import * as getCanvasPixelColor from 'get-canvas-pixel-color'
import { extractColors } from './extractColors'
import { calcAverageColor } from './calcAverageColor'
import { RgbObj } from 'types';

export const getColor = (targetCanvas: HTMLCanvasElement, x: number, y: number, pickRadius?: number): RgbObj => {
  if (pickRadius === undefined || pickRadius === 0) {
    return getCanvasPixelColor(targetCanvas, x, y);
  } else {
    const colorBlock = extractColors(targetCanvas, pickRadius, x, y);
    return calcAverageColor(colorBlock);
  }
}
