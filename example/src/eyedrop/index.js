// @flow
import html2canvas from 'html2canvas'
import React, {
  Node,
  useCallback,
  useEffect,
  useState
} from 'react'
import { extractColor } from './extractColor'

import { getCanvasBlockColors } from './getCanvasBlockColors'
import { imageToCanvas } from './imageToCanvas'
import rgbToHex from './rgbToHex'
import { validatePickRadius } from './validatePickRadius'

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
  customComponent?: Node,
  once?: boolean,
  cursorActive?: string,
  cursorInactive?: string,
  onInit?: Function,
  onPickStart?: Function,
  colorsPassThrough?: string,
  pickRadius?: number,
  disabled?: boolean
}

type Colors = {
  rgb: string,
  hex: string
}

export const EyeDropper = (props: Props) => {
  const [colors, setColors] = useState<Colors>({ rgb: '', hex: '' })
  const [pickingColorFromDocument, setPickingColorFromDocument] = useState<boolean>(false)
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
  
  const {
    once = true
  } = props
  
  const cursorActive = props.cursorActive ? props.cursorActive : 'copy'
  const cursorInactive = props.cursorInactive ? props.cursorInactive : 'auto'
  
  // exiting continuous pick when esc key is pressed
  const exitPick = useCallback(event => {
    if (event.keyCode === 27) {
      setPickingColorFromDocument(false)
      setButtonDisabled(false)
      document.body.style.cursor = cursorInactive
    }
  }, [])
  
  // handles button click event to start the action
  const pickColor = () => {
    const {
      onPickStart,
      disabled
    } = props
    
    if (onPickStart) { onPickStart() }
    
    document.body.style.cursor = cursorActive
    setPickingColorFromDocument(true)
    setButtonDisabled(disabled ? disabled : true)
  }
  
  const targetToCanvas = (e: *) => {
    const { pickRadius } = props
    const eventTarget = e.target
    
    if(e.target.nodeName.toLowerCase() === 'img') {
      // Convert image to canvas because `html2canvas` can not
      const canvasElement = imageToCanvas(eventTarget)
      const { r, g, b } = extractColor(canvasElement, e.offsetX, e.offsetY)
      updateColors({ r, g, b })
      once === true && deactivateColorPicking()
      return
    }
    
    html2canvas(e.target, { logging: false })
    .then((canvasEl) => {
      if (pickRadius === undefined || pickRadius === 0) {
        const { r, g, b } = extractColor(canvasEl, e.pageX, e.pageY)
        updateColors({ r, g, b })
      } else {
        extractColors(canvasEl, e)
      }
    })
    
    once === true && deactivateColorPicking()
  }
  
  const deactivateColorPicking = () => {
    setPickingColorFromDocument(false)
    setButtonDisabled(false)
    document.body.style.cursor = cursorInactive
  }
  
  const extractColors = (canvas: *, e: *) => {
    const { pageX, pageY } = e
    const { pickRadius } = props
    
    const startingX = pageX - pickRadius
    const startingY = pageY - pickRadius
    const pickWidth = pickRadius * 2
    const pickHeight = pickRadius * 2
    
    const colorBlock = getCanvasBlockColors(canvas, startingX, startingY, pickWidth, pickHeight)
    calcAverageColor(colorBlock)
  }
  
  const calcAverageColor = (colorBlock: Array<{ r: number, g: number, b: number }>) => {
    const totalPixels = colorBlock.length
    
    const rgbAverage = colorBlock.reduce((rgbAcc, colorsObj) => {
      rgbAcc[0] += Math.round(colorsObj.r / totalPixels)
      rgbAcc[1] += Math.round(colorsObj.g / totalPixels)
      rgbAcc[2] += Math.round(colorsObj.b / totalPixels)
      return rgbAcc
    }, [0, 0, 0])
    
    updateColors({ r: rgbAverage[0], g: rgbAverage[1], b: rgbAverage[2] })
  }
  
  const updateColors = ({ r, g, b }) => {
    const {
      onChange
    } = props
    const rgb = `rgb(${r}, ${g}, ${b})`
    const hex = rgbToHex(r, g, b)
    
    // set color object to parent handler
    onChange({ rgb, hex, customProps })
    
    setColors({ rgb, hex })
  }
  
  // initial stage of life cycle, catching errors
  useEffect(() => {
    const { onInit, pickRadius } = props
    
    if (onInit) { onInit() }
    
    pickRadius && validatePickRadius(pickRadius)
  }, [])
  
  // setup listener for canvas picking click
  useEffect(() => {
    if (pickingColorFromDocument) {
      document.addEventListener("click", targetToCanvas)
    }
    return () => {
      if (once || pickingColorFromDocument) {
        document.removeEventListener("click", targetToCanvas)
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
        <button
          id={'react-eyedrop-button'}
          style={styles.eyedropperWrapperButton}
          className={buttonClasses}
          onClick={pickColor}
          disabled={buttonDisabled}
        >
          {children}
        </button>
      )}
    </div>
  )
}