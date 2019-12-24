// @flow
import React, { useState, useEffect } from 'react'
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
  const [once, setOnce] = useState(true);

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
    console.log("entering useEffect");
    
    // this removes event listener when toggling 'once' from false to true
    if (once !== props.once){
      setPickingColorFromDocument(false);
      document.body.style.cursor = cursorInactive;
    }

    if (pickingColorFromDocument) {      
      document.addEventListener("click", targetToCanvas)
    }

    return () => {
      document.removeEventListener("click", targetToCanvas)
    }
  }, [pickingColorFromDocument, props.once])

  const pickColor = () => {
    const { onPickStart } = props  

    // prevent setting 'once' every time when there is no change
    if (props.once !== once) { setOnce(props.once); }   

    if (onPickStart) { onPickStart() }
    
    document.body.style.cursor = cursorActive;
    setPickingColorFromDocument(true);
  }

  const targetToCanvas = (e: *) => {
    const { target } = e
    const { pickRadius } = props

    html2canvas(target, { logging: false })
      .then((canvas) => {
        if (pickRadius) {
          extractColors(canvas, e)
        } else {
          extractColor(canvas, e)
        }
      })

    if (once) {
      setPickingColorFromDocument(false)      
      document.body.style.cursor = cursorInactive
    }
  }

  const extractColor = (canvas: *, e: *) => {
    const { offsetX, offsetY } = e

    let colorsFromCanvas = getCanvasPixelColor(canvas, offsetX, offsetY)
    updateColors(colorsFromCanvas)
  }

  const extractColors = (canvas: *, e: *) => {
    const { offsetX, offsetY } = e
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
        radialOffsetX = (offsetX - x)
        radialOffsetY = (offsetY - y)

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
    const rgb = `rgb(${r}, ${b}, ${g})`
    const hex = rgbToHex(r, b, g)
    
    if (passThrough) { setColors({ rgb, hex }) }
    props.onChange({ rgb, hex })
    if (onPickEnd) { onPickEnd() }
  }

  const {
    wrapperClasses,
    buttonClasses,
    customComponent: CustomComponent,
    passThrough,
    children
  } = props

  const shouldPassThrough = passThrough ? { [passThrough]: colors } : {}

  return (
    <div style={styles.eyedropperWrapper} className={wrapperClasses}>
      {CustomComponent ? (
        <CustomComponent
          onClick={pickColor}
          {...shouldPassThrough}
        />
      ) : (
          <button
            style={styles.eyedropperWrapperButton}
            className={buttonClasses}
            onClick={pickColor}
          >
            {children ? children : 'Eye-Drop'}
          </button>
        )}
    </div>
  )
}

export default EyeDropper;