// @flow
import React, { useState, useEffect, useCallback } from 'react'
import type, { Node } from 'react'
import html2canvas from 'html2canvas'
import getCanvasPixelColor from 'get-canvas-pixel-color'

import rgbToHex from './rgbToHex'

const styles = {
  eyedropperWrapper: {
    position: 'relative'
  },
  eyedropperWrapperButton: {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20%',
    padding: '10px 25px',
  }
}

type Props = {
  onChange: Function,
  wrapperClasses?: string,
  buttonClasses?: string,
  customComponent?: Node,
  once?: boolean,
  cursorActive?: string,
  cursorInactive?: string,
  onInit?: Function,
  onPickStart?: Function,
  onPickEnd?: Function,
  passThrough?: string,
  pickRadius?: { unit: 'pixel' | 'radius', amount: number }
}

type State = {
  colors: {
    rgb: string,
    hex: string
  },
  pickingColorFromDocument: boolean
}

const EyeDropper = props => {
  const [colors, setColors] = useState({ rgb: '', hex: '' });
  const [pickingColorFromDocument, setPickingColorFromDocument] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false); 

  // for canvas
  var initialCanvas = document.createElement("canvas");
  const [canvas, setCanvas] = useState(initialCanvas);
  const [clickEvent, setClickEvent] = useState(false);

  const cursorActive = props.cursorActive ? props.cursorActive : 'copy'
  const cursorInactive = props.cursorInactive ? props.cursorInactive : 'auto'

  useEffect(() => {
    const { onInit, pickRadius } = props

    if (onInit) { onInit() }
    if (pickRadius) {
      if (pickRadius.amount < 1) {
        throw new Error('Amount should never be below 1.')
      }
    }
  }, []);

  useEffect(() => {
    // setting "props.once" property
    let once;    
    if (typeof props.once !== "undefined") { once = props.once; }
    else { once = true; } // set default to true

    // console.log("start of cycle props once: " + once)

    if (pickingColorFromDocument) {
      document.addEventListener("click", targetToCanvas)
    }
    return () => {
      // console.log("removing listener")
      // console.log("end of cycle props once: " + props.once)

      if (once || pickingColorFromDocument) {
        document.removeEventListener("click", targetToCanvas)
      }
    }
  }, [pickingColorFromDocument, props.once])

  // get and process stored canvas and click event states before next mount
  useEffect(() => {
    return () => {
      if (clickEvent) {
        const { pickRadius } = props

        if (pickRadius) {
          extractColors(canvas, clickEvent)
        } else {
          extractColor(canvas, clickEvent)
        }
        setClickEvent(false);
      }
    }
  })

  // setup listener for the esc key 
  useEffect(() => {
    window.addEventListener('keydown', exitPick)
    return () => {
      document.addEventListener('keydown', exitPick);
    }
  }, [exitPick])

  // exiting continuous pick when esc key is pressed
  const exitPick = useCallback(event => {    
    // console.log("current props.once " + props.once)
    // console.log("current pickingColorFromDocument" + pickingColorFromDocument)
    
    if (event.keyCode === 27) {
      // console.log("esc key pressed, exiting pick")
      setPickingColorFromDocument(false)
      setButtonDisabled(false);
      document.body.style.cursor = cursorInactive
    }
  }, [])

  // handles button click to start/stop action
  const pickColor = () => {
    const { onPickStart, once } = props

    setButtonDisabled(true)
    if (onPickStart) { onPickStart() }
    document.body.style.cursor = cursorActive;
    setPickingColorFromDocument(true);
  }

  const targetToCanvas = (e: *) => {
    html2canvas(document.body)
      .then((canvasEl) => {     
        // console.log('canvas captured: ' + canvasEl)

        // stores canvas and click event states to process before next mount
        setClickEvent(e);
        setCanvas(canvasEl);
        // console.log('current canvas state:' + canvas);
      })

    // console.log('in drawing once: ' + props.once)

    if (props.once === true || props.once === undefined) {
      // console.log('turning off single picking')
      setPickingColorFromDocument(false)
      setButtonDisabled(false);
      document.body.style.cursor = cursorInactive
    }
  }

  const extractColor = (canvas: *, e: *) => {
    // console.log("entering extraColor func");
    const { pageX, pageY } = e
    // console.log("X-position: " + pageX + "  Y-position: " + pageY);

    let pixelColor = getCanvasPixelColor(canvas, pageX, pageY)
    updateColors(pixelColor)
  }

  const extractColors = (canvas: *, e: *) => {
    const { pageX, pageY } = e
    const { unit, amount } = props.pickRadius

    let maxRadius, minRadius
    if (unit === 'radius') {
      maxRadius = amount
      minRadius = -(amount) - 1
    } else if (unit === 'pixel') {
      if (amount % 2 !== 0) {
        maxRadius = ((amount - 1) / 2)
        minRadius = -((amount - 1) / 2) - 1
      } else {
        throw new Error('[EyeDrop] The unit \'pixel\' may only have an odd amount.')
      }
    } else {
      throw new Error('[EyeDrop] Please define a proper unit type.')
    }

    const colorBlock = []
    let radialOffsetX, radialOffsetY

    for (let x = maxRadius; x !== minRadius; x--) {
      for (let y = maxRadius; y !== minRadius; y--) {
        radialOffsetX = (pageX - x)
        radialOffsetY = (pageY - y)

        if (!(radialOffsetX < 0) && !(radialOffsetY < 0)) {
          colorBlock.push(getCanvasPixelColor(canvas, radialOffsetX, radialOffsetY))
        }
      }
    }
    calcAverageColor(colorBlock)
  }

  const calcAverageColor = (colorBlock: Array<{ r: number, g: number, b: number }>) => {
    let totalR = 0, totalG = 0, totalB = 0
    colorBlock.map(({ r, g, b }, index) => {
      totalR += r * r
      totalG += g * g
      totalB += b * b
      if (index !== 0) {
        totalR = Math.sqrt(totalR / 2)
        totalG = Math.sqrt(totalG / 2)
        totalB = Math.sqrt(totalB / 2)
      }
    })
    const averageR = parseInt(totalR)
    const averageG = parseInt(totalG)
    const averageB = parseInt(totalB)
    updateColors({ r: averageR, g: averageG, b: averageB })
  }

  const updateColors = ({ r, g, b }) => {
    const { onPickEnd, passThrough } = props
    const rgb = `rgb(${r}, ${g}, ${b})`
    const hex = rgbToHex(r, g, b)

    if (passThrough) { setColors({ rgb, hex }) }

    // set color object to parent handler
    props.onChange({ rgb, hex, buttonDisabled, customProps})

    if (onPickEnd) { onPickEnd() }
  }

  const {
    wrapperClasses,
    buttonClasses,
    customComponent: CustomComponent,
    passThrough,
    children,
    customProps 
  } = props

  const shouldPassThrough = passThrough ? { [passThrough]: colors } : {}

  return (
    <div style={styles.eyedropperWrapper} className={wrapperClasses}>
      {CustomComponent ? (
        <CustomComponent
          onClick={pickColor}
          {...shouldPassThrough}          
          customProps={customProps}
        />
      ) : (
          <button
            style={styles.eyedropperWrapperButton}
            className={buttonClasses}
            onClick={pickColor}
            disabled={buttonDisabled}
          >
            {children ? children : ''}
          </button>
        )}
    </div>
  )
}

export default EyeDropper;