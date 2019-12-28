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
  colorsPassThrough?: string,
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

  const cursorActive = props.cursorActive ? props.cursorActive : 'copy'
  const cursorInactive = props.cursorInactive ? props.cursorInactive : 'auto'

  // initial stage of life cycle, catching errors
  useEffect(() => {
    const { onInit, pickRadius } = props

    if (onInit) { onInit() }
    if (pickRadius) {
      if (pickRadius.amount < 1) {
        throw new Error('Amount should never be below 1.')
      }
    }
  }, []);

  // setup listener for canvas picking click
  useEffect(() => {
    // setting "props.once" property
    let once;
    if (typeof props.once !== "undefined") { once = props.once; }
    else { once = true; } // set default to true

    if (pickingColorFromDocument) {
      document.addEventListener("click", targetToCanvas)
    }
    return () => {
      if (once || pickingColorFromDocument) {
        document.removeEventListener("click", targetToCanvas)
      }
    }
  }, [pickingColorFromDocument, props.once])

  // setup listener for the esc key 
  useEffect(() => {
    window.addEventListener('keydown', exitPick)
    return () => {
      document.addEventListener('keydown', exitPick);
    }
  }, [exitPick])

  // end of life cycle, processing gathered data after colors updated
  useEffect(() => {
    return () => {
      const { onPickEnd } = props
      const { rgb, hex } = colors

      // set color object to parent handler
      props.onChange({ rgb, hex, customProps })

      if (onPickEnd) { onPickEnd() }
    }
  }, [colors])

  // exiting continuous pick when esc key is pressed
  const exitPick = useCallback(event => {
    if (event.keyCode === 27) {     
      setPickingColorFromDocument(false)
      setButtonDisabled(false);
      document.body.style.cursor = cursorInactive
    }
  }, [])

  // handles button click event to start the action
  const pickColor = () => {    
    const { onPickStart } = props

    if (onPickStart) { onPickStart() }
    document.body.style.cursor = cursorActive;
    setPickingColorFromDocument(true);
    setButtonDisabled(true);
  }

  const targetToCanvas = (e: *) => {
    html2canvas(document.body)
      .then((canvasEl) => {
        const { pickRadius } = props

        if (pickRadius) {
          extractColors(canvasEl, e)
        } else {
          extractColor(canvasEl, e)
        }
      })

    if (props.once === true || props.once === undefined) {
      setPickingColorFromDocument(false)
      setButtonDisabled(false);
      document.body.style.cursor = cursorInactive
    }
  }

  const extractColor = (canvas: *, e: *) => {
    const { pageX, pageY } = e

    const pixelColor = getCanvasPixelColor(canvas, pageX, pageY)
    // console.log(pixelColor);

    const { r, g, b } = pixelColor;
    updateColors({ r: r, g: g, b: b });
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
    const rgb = `rgb(${r}, ${g}, ${b})`
    const hex = rgbToHex(r, g, b)

    setColors({ rgb, hex })
  }

  const {
    wrapperClasses,
    buttonClasses,
    customComponent: CustomComponent,
    colorsPassThrough,
    children,
    customProps,
  } = props

  const shouldColorsPassThrough = colorsPassThrough ? { [colorsPassThrough]: colors } : {}

  return (
    <div style={styles.eyedropperWrapper} className={wrapperClasses}>
      {CustomComponent ? (
        <CustomComponent
          onClick={pickColor}
          {...shouldColorsPassThrough}
          customProps={customProps}
          disabled={buttonDisabled}
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