import * as getCanvasPixelColor from 'get-canvas-pixel-color'
import { extractColors } from './extractColors'
import { calcAverageColor } from './calcAverageColor'

export const getColor = (pickRadius: number, targetCanvas: HTMLCanvasElement, e: any) => {
  const { offsetX, offsetY } = e;
  if (pickRadius === undefined || pickRadius === 0) {
    return getCanvasPixelColor(targetCanvas, offsetX, offsetY);
  } else {
    const colorBlock = extractColors(targetCanvas, pickRadius, offsetX, offsetY);
    return calcAverageColor(colorBlock);
  }
}
