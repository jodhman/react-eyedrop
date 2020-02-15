// @flow

import { getCanvasBlockColors } from './get-canvas-block-colors'

export const extractColors = (canvas: *, pickRadius: number, x: number, y: number) => {
  const startingX = x - pickRadius
  const startingY = y - pickRadius
  const pickWidth = pickRadius * 2
  const pickHeight = pickRadius * 2
  
  return getCanvasBlockColors(canvas, startingX, startingY, pickWidth, pickHeight)
}