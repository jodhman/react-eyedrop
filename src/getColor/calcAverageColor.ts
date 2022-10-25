import {
  VAL_NOT_RGB_OBJ_ARRAY_ERROR,
  ZERO_PIXELS_FOUND_ERROR
} from '../constants/errors';
import { RgbObj } from '../types';

export const calcAverageColor = (colorBlock: Array<RgbObj>): RgbObj => {
  const totalPixels = colorBlock.length;

  if(typeof colorBlock !== 'object' || typeof colorBlock.reduce === 'undefined') {
    throw VAL_NOT_RGB_OBJ_ARRAY_ERROR;
  }

  if(totalPixels === 0) {
    throw ZERO_PIXELS_FOUND_ERROR;
  }

  if(totalPixels === 1) {
    return colorBlock[0];
  }

  const rgbPrimary = colorBlock
    .map(array => JSON.stringify(array))
    .filter((item, index, array) => array.indexOf(item) === index)
    .map(string => JSON.parse(string))

  return { r: rgbPrimary[0][0], g: rgbPrimary[0][1], b: rgbPrimary[0][2] }
};
