// @flow
import React, { useState, useEffect, useCallback } from 'react'
import type, { Node } from 'react'
import html2canvas from 'html2canvas'
import getCanvasPixelColor from 'get-canvas-pixel-color'

import { getCanvasBlockColors } from './getCanvasBlockColors'
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
  pickRadius?: number,
  disabled?: boolean
}

type State = {
  colors: {
    rgb: string,
    hex: string
  },
  pickingColorFromDocument: boolean,
  buttonDisabled: boolean
}

export const EyeDropper = props => {

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
      if (pickRadius < 0 || pickRadius > 450) {
        throw new Error('pickRadius out of range: 0-450')
      }
    }
  }, []);

  // setup listener for canvas picking click
  useEffect(() => {
    // setting "props.once" property
    let once
    if (typeof props.once !== "undefined") { once = props.once }
    else { once = true } // set default to true

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
    document.addEventListener('keydown', exitPick)
    return () => {
      document.removeEventListener('keydown', exitPick);
    }
  }, [exitPick])

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
    // user declared "disabled" property
    if (disabled === false) {
      setButtonDisabled(disabled);
    } else {
      setButtonDisabled(true);
    }  
  }

  const targetToCanvas = (e: *) => {
    const { pickRadius } = props
    
    html2canvas(document.body, { logging: false })
      .then((canvasEl) => {
        if (pickRadius === undefined || (pickRadius >= 0 && pickRadius < 1)) {
          extractColor(canvasEl, e)
        } else {
          extractColors(canvasEl, e)
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
    const { r, g, b } = pixelColor;

    updateColors({ r: r, g: g, b: b });
  }

  const extractColors = (canvas: *, e: *) => {
    const { pageX, pageY } = e
    const { pickRadius } = props

    const startingX = pageX - pickRadius
    const startingY = pageY - pickRadius
    const pickWidth = pickRadius * 2
    const pickHeight = pickRadius * 2

    const colorBlock = getCanvasBlockColors(canvas, startingX, startingY, pickWidth, pickHeight);
    calcAverageColor(colorBlock);
  }

  const calcAverageColor = (colorBlock: Array<{ r: number, g: number, b: number }>) => {
    const totalPixels = colorBlock.length

    const rgbAverage = colorBlock.reduce((rgbAcc, colorsObj) => {
      rgbAcc[0] += colorsObj.r
      rgbAcc[1] += colorsObj.g
      rgbAcc[2] += colorsObj.b
      return rgbAcc
    }, [0, 0, 0]).map(acc => Math.round(acc / totalPixels))

    updateColors({ r: rgbAverage[0], g: rgbAverage[1], b: rgbAverage[2] })
  }

  const updateColors = ({ r, g, b }) => {
    const { onPickEnd } = props
    const rgb = `rgb(${r}, ${g}, ${b})`
    const hex = rgbToHex(r, g, b)

    // set color object to parent handler      
    props.onChange({ rgb, hex, customProps })

    setColors({ rgb, hex })

    if (onPickEnd) { onPickEnd() }
  }

  const {
    wrapperClasses,
    buttonClasses,
    customComponent: CustomComponent,
    colorsPassThrough,
    children,
    disabled,
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