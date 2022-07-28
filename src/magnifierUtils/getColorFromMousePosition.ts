import * as React from 'react'
import * as getCanvasPixelColor from 'get-canvas-pixel-color'
import { RgbObj } from '../types'

export const getColorFromMousePosition = (
  event: React.MouseEvent<HTMLDivElement>,
  magnifier: HTMLDivElement,
  targetRect: DOMRect,
  zoom: number
) => {
  if (!targetRect) {
    return
  }
  const { clientX, clientY } = event
  const { scrollX, scrollY } = magnifier.ownerDocument.defaultView
  const canvas = magnifier.querySelector('canvas')
  const { left, top } = targetRect
  const x = (clientX + scrollX - left) * 2 - zoom
  const y = (clientY + scrollY - top) * 2 - zoom
  const color: RgbObj = getCanvasPixelColor(canvas, x, y)
  return color
}
