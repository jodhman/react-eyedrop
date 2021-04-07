import { ELEMENT_NOT_CANVAS_ERROR } from './constants/errors';
import { RgbObj } from './types';
import { validateCanvasExtractionValues } from './validateCanvasExtractionValues';

export const getCanvasBlockColors = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): Array<RgbObj> => {
  if(!canvas.getContext) {
    throw ELEMENT_NOT_CANVAS_ERROR;
  }
  const ctx = canvas.getContext('2d')!;

  const validatedExtractionValues = validateCanvasExtractionValues({
    x,
    y,
    targetHeight: height,
    targetWidth: width,
    canvasHeight: canvas.height,
    canvasWidth: canvas.width
  });

  const imageData = ctx.getImageData(
    validatedExtractionValues.x,
    validatedExtractionValues.y,
    validatedExtractionValues.targetWidth,
    validatedExtractionValues.targetHeight
  ).data;

  const colorBlock = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const color = imageData.slice(i, i + 4);
    colorBlock.push({
      r: color[0],
      g: color[1],
      b: color[2]
    });
  }
  return colorBlock;
};
