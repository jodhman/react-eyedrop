import { ERROR_MSGS } from '../src/constants/errors'
import { calcAverageColor } from '../src/getColor/calcAverageColor'

const black = {
  r: 0,
  g: 0,
  b: 0
}
const white = {
  r: 255,
  g: 255,
  b: 255
}

describe('calcAverageColor should', () => {
  const mockColorBlock = [
    black,
    white
  ]

  it('return the average color', () => {
    expect(calcAverageColor(mockColorBlock)).toEqual({
      r: 128,
      g: 128,
      b: 128
    })
  })

  it('return one color if color block only has one pixel', () => {
    expect(calcAverageColor([black])).toEqual(black)
  })

  it('throw if 0 pixels in color block', () => {
    expect(() => calcAverageColor([])).toThrow(ERROR_MSGS.calcAverageColor.noPixelsFound)
  })

  it('throw if argument is not array', () => {
    // @ts-ignore
    expect(() => calcAverageColor(black)).toThrow(ERROR_MSGS.calcAverageColor.notArrayOfRgbObj)
    // @ts-ignore
    expect(() => calcAverageColor('black')).toThrow(ERROR_MSGS.calcAverageColor.notArrayOfRgbObj)
    // @ts-ignore
    expect(() => calcAverageColor(35)).toThrow(ERROR_MSGS.calcAverageColor.notArrayOfRgbObj)
  })
})
