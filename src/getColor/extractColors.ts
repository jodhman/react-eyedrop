import { getCanvasBlockColors } from './getCanvasBlockColors';

export const extractColors = (canvas: HTMLCanvasElement, pickRadius: number, x: number, y: number) => {
  const startingX = x - pickRadius;
  const startingY = y - pickRadius;
  const pickWidth = pickRadius * 2;
  const pickHeight = pickRadius * 2;

  return getCanvasBlockColors(canvas, startingX, startingY, pickWidth, pickHeight);
};
