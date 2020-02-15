// @flow
import getCanvasPixelColor from 'get-canvas-pixel-color'

export const extractColor = (canvas: *, x: number, y: number) => getCanvasPixelColor(canvas, x, y)