import * as getCanvasPixelColor from 'get-canvas-pixel-color'
import { extractColors } from './extractColors'
import { calcAverageColor } from './calcAverageColor'
import { RgbObj } from '../types'

export const getColor = (pickRadius: number, targetCanvas: HTMLCanvasElement, e: MouseEvent): RgbObj => {
  const { offsetX, offsetY } = e;
  if (pickRadius === undefined || pickRadius === 0) {
    return getCanvasPixelColor(targetCanvas, offsetX, offsetY);
  } else {
    const colorBlock = extractColors(targetCanvas, pickRadius, offsetX, offsetY);
    return calcAverageColor(colorBlock);
  }
}
