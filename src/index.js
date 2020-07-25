// @flow
import html2canvas from 'html2canvas'
import getCanvasPixelColor from 'get-canvas-pixel-color'
import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import type { AbstractComponent, Node } from 'react'
import { calcAverageColor } from './calc-average-color'
import { extractColors } from './extract-colors'
import { imageToCanvas } from './image-to-canvas'
import { parseRGB } from './parse-rgb'
import { rgbToHex } from './rgb-to-hex'
import type { RgbObj } from './types'
import { validatePickRadius } from './validate-pick-radius'

const styles = {
  eyedropperWrapper: {
    position: 'relative'
  },
  eyedropperWrapperButton: {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '20%',
    padding: '10px 25px',
  }
}

type Props = {
  onChange: Function,
  wrapperClasses?: string,
  buttonClasses?: string,
  customComponent?: AbstractComponent<{}>,
  once?: boolean,
  cursorActive?: string,
  cursorInactive?: string,
  onInit?: Function,
  onPickStart?: Function,
  colorsPassThrough?: string,
  pickRadius?: number,
  disabled?: boolean,
  children?: Node,
  customProps?: { [key: string]: any }
}

type StateColors = {
  rgb: string,
  hex: string
}
const initialStateColors = { rgb: '', hex: '' }

export const EyeDropper = (props: Props) => {
  const [colors, setColors] = useState<StateColors>(initialStateColors)
  const [pickingColorFromDocument, setPickingColorFromDocument] = useState<boolean>(false)
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
  
  const {
    once = true,
    pickRadius = 0
  } = props
  
  const cursorActive = props.cursorActive ? props.cursorActive : 'copy'
  const cursorInactive = props.cursorInactive ? props.cursorInactive : 'auto'
  
  const setPickingMode = (isPicking: boolean, disableButton: boolean, showActiveCursor: boolean) => {
    if(document.body) {
      document.body.style.cursor = showActiveCursor ? cursorActive : cursorInactive
    }
    setPickingColorFromDocument(isPicking)
    setButtonDisabled(disableButton)
  }
  
  // exiting continuous pick when esc key is pressed
  const exitPick = useCallback((event: KeyboardEvent) => event.keyCode === 27 && (
    setPickingMode(false, false, false)
  ), [])
  
  // handles button click event to start the action
  const pickColor = () => {
    const {
      onPickStart,
      disabled
    } = props
    
    if (onPickStart) { onPickStart() }
    
    setPickingMode(true, disabled || true, true)
  }
  
  const deactivateColorPicking = () => setPickingMode(false, false, false)
  
  const targetToCanvas = (e: any) => {
    const { target } = e

    if(e.target.nodeName.toLowerCase() === 'img') {
      // Convert image to canvas because `html2canvas` can not
      const { offsetX, offsetY } = e
      const canvasElement = imageToCanvas(target)
      const { r, g, b } = getCanvasPixelColor(canvasElement, offsetX, offsetY)
      updateColors({ r, g, b })
      once === true && deactivateColorPicking()
      return
    }

    const { offsetX, offsetY } = e
    html2canvas(target, { logging: false })
    .then((canvasEl) => {
      if (pickRadius === undefined || pickRadius === 0) {
        const { r, g, b } = getCanvasPixelColor(canvasEl, offsetX, offsetY)
        updateColors({ r, g, b })
      } else {
        const colorBlock = extractColors(canvasEl, pickRadius, offsetX, offsetY)
        const rgbColor = calcAverageColor(colorBlock)
        updateColors(rgbColor)
      }
    })
    
    once === true && deactivateColorPicking()
  }
  
  const updateColors = (rgbObj: RgbObj) => {
    const {
      onChange
    } = props
    const rgb = parseRGB(rgbObj)
    const hex = rgbToHex(rgbObj)
    
    // set color object to parent handler
    onChange({ rgb, hex, customProps })
    
    setColors({ rgb, hex })
  }
  
  // initial stage of life cycle, catching errors
  useEffect(() => {
    const { onInit } = props
    
    if (onInit) { onInit() }
    
    pickRadius && validatePickRadius(pickRadius)
  }, [])
  
  // setup listener for canvas picking click
  useEffect(() => {
    if (pickingColorFromDocument) {
      document.addEventListener('click', targetToCanvas)
    }
    return () => {
      if (once || pickingColorFromDocument) {
        document.removeEventListener('click', targetToCanvas)
      }
    }
  }, [pickingColorFromDocument, once])
  
  // setup listener for the esc key
  useEffect(() => {
    document.addEventListener('keydown', exitPick)
    return () => {
      document.removeEventListener('keydown', exitPick)
    }
  }, [exitPick])
  
  const {
    wrapperClasses,
    buttonClasses,
    customComponent: CustomComponent,
    colorsPassThrough,
    children,
    customProps
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
        <>
          <style dangerouslySetInnerHTML={{__html: `
            .react-eyedrop-button {
              background-color: #000000;
              color: #ffffff;
              border: 1px solid #ffffff;
              border-radius: 20%;
              padding: 10px 25px;
            }
          `}} />
          <button
            id={'react-eyedrop-button'}
            className={`react-eyedrop-button ${buttonClasses || ''}`}
            onClick={pickColor}
            disabled={buttonDisabled}
          >
            {children}
          </button>
        </>
      )}
    </div>
  )
}