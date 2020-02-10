// @flow
import getCanvasPixelColor from 'get-canvas-pixel-color'

export const extractColor = (canvas, x, y) => getCanvasPixelColor(canvas, x, y)