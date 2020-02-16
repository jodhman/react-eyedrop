// @flow

export const calcAverageColor = (colorBlock: Array<{ r: number, g: number, b: number }>): { r: number, g: number, b: number } => {
  const totalPixels = colorBlock.length
  
  if(typeof colorBlock !== 'object' || typeof colorBlock.reduce === 'undefined') {
    throw new Error('calcAverageColor: only accepts array of colors')
  }
  
  if(totalPixels === 0) {
    throw new Error('calcAverageColor: 0 pixels found')
  }
  
  if(totalPixels === 1) {
    return colorBlock[0]
  }
  
  const rgbAverage = colorBlock.reduce((rgbAcc, colorsObj) => {
    rgbAcc[0] += Math.round(colorsObj.r / totalPixels)
    rgbAcc[1] += Math.round(colorsObj.g / totalPixels)
    rgbAcc[2] += Math.round(colorsObj.b / totalPixels)
    return rgbAcc
  }, [0, 0, 0])
  
  return { r: rgbAverage[0], g: rgbAverage[1], b: rgbAverage[2] }
}