// @flow

export const calcAverageColor = (colorBlock: Array<{ r: number, g: number, b: number }>): { r: number, g: number, b: number } => {
  const totalPixels = colorBlock.length
  
  const rgbAverage = colorBlock.reduce((rgbAcc, colorsObj) => {
    rgbAcc[0] += Math.round(colorsObj.r / totalPixels)
    rgbAcc[1] += Math.round(colorsObj.g / totalPixels)
    rgbAcc[2] += Math.round(colorsObj.b / totalPixels)
    return rgbAcc
  }, [0, 0, 0])
  
  return { r: rgbAverage[0], g: rgbAverage[1], b: rgbAverage[2] }
}