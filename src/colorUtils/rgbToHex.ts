import { RgbObj } from '../types';

const numberToHex = (rgb: number) => {
  let hex = rgb.toString(16);
  if (hex.length < 2) {
    hex = `0${hex}`;
  }
  return hex;
};

export const rgbToHex = (rgbObj: RgbObj): string => {
  const {
    r,
    g,
    b
  } = rgbObj;
  const red = numberToHex(r);
  const green = numberToHex(g);
  const blue = numberToHex(b);
  return `#${red}${green}${blue}`;
};
