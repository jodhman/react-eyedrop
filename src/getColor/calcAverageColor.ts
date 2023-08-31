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

  const rgbAverage = colorBlock.reduce((rgbAcc, colorsObj) => {
    rgbAcc[0] += Math.round(colorsObj.r / totalPixels);
    rgbAcc[1] += Math.round(colorsObj.g / totalPixels);
    rgbAcc[2] += Math.round(colorsObj.b / totalPixels);
    return rgbAcc;
  }, [0, 0, 0]);

  return { r: rgbAverage[0], g: rgbAverage[1], b: rgbAverage[2] };
};
