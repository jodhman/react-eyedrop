// @flow

export default (r: number, g: number, b: number) => {
  const red = rgbToHex(r)
  const green = rgbToHex(g)
  const blue = rgbToHex(b)
  return `#${red}${green}${blue}`
}

export const rgbToHex = (rgb: number) => {
  let hex = rgb.toString(16)
  if (hex.length < 2) {
    hex = `0${hex}`
  }
  return hex
}