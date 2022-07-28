import { RgbObj } from '../types'

const numberToHex = (rgb: number) => {
  const hex = rgb.toString(16)
  return hex.length < 2 ? `0${hex}` : hex
}

export const rgbToHex = (rgbObj: RgbObj): string => {
  const { r, g, b } = rgbObj
  const red = numberToHex(r)
  const green = numberToHex(g)
  const blue = numberToHex(b)
  return `#${red}${green}${blue}`
}
