// @flow

import { ELEMENT_NOT_CANVAS_ERROR } from './constants/errors'
import { validateCanvasExtractionValues } from './validate-canvas-extraction-values'

export const getCanvasBlockColors = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): Array<{r: number, g: number, b: number}> => {
  if(!canvas.getContext) {
    throw ELEMENT_NOT_CANVAS_ERROR
  }
  const ctx = canvas.getContext('2d')

  const validatedExtractionValues = validateCanvasExtractionValues({
    x,
    y,
    targetHeight: height,
    targetWidth: width,
    canvasHeight: canvas.height,
    canvasWidth: canvas.width
  })
  
  const imageData = ctx.getImageData(
    validatedExtractionValues.x,
    validatedExtractionValues.y,
    validatedExtractionValues.targetWidth,
    validatedExtractionValues.targetHeight
  ).data

  let colorBlock = []
  for (let i = 0; i < imageData.length; i += 4) {
    const [r, g, b, a] = imageData.slice(i, i + 4)
    colorBlock.push({ r: r, g: g, b: b })
  }
  return colorBlock
}
