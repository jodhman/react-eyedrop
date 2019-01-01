// @flow
import React from 'react'
import type { Node } from 'react'
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
  pickRadius?: number
}

type State = {
  colors: {
    rgb: string,
    hex: string
  }
}

export default class EyeDropper extends React.Component<Props, {}> {
  constructor(props) {
    super(props)
    this.state = {
      colors: { rgb: '', hex: '' }
    }
    this.once = (props.once !== undefined) ? props.once : true
    this.cursorActive = props.cursorActive ? props.cursorActive : 'copy'
    this.cursorInactive = props.cursorInactive ? props.cursorInactive : 'auto'
  }

  componentDidMount() {
    const { onInit } = this.props
    if (onInit) { onInit() }
  }

  pickColor = () => {
    const { onPickStart } = this.props
    const { once, cursorActive } = this

    if (onPickStart) { onPickStart() }
    document.body.style.cursor = cursorActive
    document.addEventListener('click', this.targetToCanvas, { once })
  }

  targetToCanvas = (e: *) => {
    const { target } = e
    const { pickRadius } = this.props

    html2canvas(target, { logging: false })
    .then((canvas) => {
      if (pickRadius) {
        this.extractColors(canvas, e)
      } else {
        this.extractColor(canvas, e)
      }
    })
  }

  extractColor = (canvas: *, e: *) => {
    const { offsetX, offsetY } = e

    const colors = getCanvasPixelColor(canvas, offsetX, offsetY)
    this.setColors(colors)
  }

  extractColors = (canvas: *, e: *) => {
    const { offsetX, offsetY } = e
    const { pickRadius } = this.props

    const maxRadius = (pickRadius % 2) === 0 ? (pickRadius / 2) : ((pickRadius - 1) / 2)
    const minRadius = (pickRadius % 2) === 0 ? -(pickRadius / 2) : -((pickRadius - 1) / 2) - 1
    const colors = []
    let radialOffsetX, radialOffsetY
    for(let x = maxRadius; x !== (minRadius); x--) {
      for(let y = maxRadius; y !== (minRadius); y--) {
        radialOffsetX = (offsetX - x)
        radialOffsetY = (offsetY - y)

        if (!(radialOffsetX < 0) && !(radialOffsetY < 0)) {
          colors.push(getCanvasPixelColor(canvas, radialOffsetX, radialOffsetY))
        }
      }
    }
    this.calcAverageColor(colors)
  }

  calcAverageColor = (colors: Array<{r: number, g: number, b: number}>) => {
    let totalR = 0, totalG = 0, totalB = 0
    colors.map(({ r, g, b }, index) => {
      totalR += r * r
      totalG += g * g
      totalB += b * b
      if(index !== 0) {
        totalR = Math.sqrt(totalR / 2)
        totalG = Math.sqrt(totalG / 2)
        totalB = Math.sqrt(totalB / 2)
      }
    })
    const averageR = parseInt(totalR)
    const averageG = parseInt(totalG)
    const averageB = parseInt(totalB)
    this.setColors({ r: averageR, g: averageG, b: averageB })
  }

  setColors = ({ r, g, b }) => {
    const { cursorInactive } = this
    const { onPickEnd, passThrough } = this.props
    const rgb = `rgb(${r}, ${b}, ${g})`
    const hex = rgbToHex(r, b, g)

    document.body.style.cursor = cursorInactive
    if (passThrough) { this.setState({ colors: { rgb, hex } }) }
    this.props.onChange({ rgb, hex })
    if (onPickEnd) { onPickEnd() }
  }

  render() {
    const {
      wrapperClasses,
      buttonClasses,
      customComponent: CustomComponent,
      passThrough
    } = this.props

    const shouldPassThrough = passThrough ? { [passThrough]: this.state.colors } : {}

    return (
      <div style={styles.eyedropperWrapper} className={wrapperClasses}>
        {CustomComponent ? <CustomComponent onClick={this.pickColor} {...shouldPassThrough} /> : <button style={styles.eyedropperWrapperButton} className={buttonClasses} onClick={this.pickColor}>Eye-Drop</button>}
      </div>
    )
  }
}