"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcAverageColor = void 0;
const errors_1 = require("./constants/errors");
const calcAverageColor = (colorBlock) => {
    const totalPixels = colorBlock.length;
    if (typeof colorBlock !== 'object' || typeof colorBlock.reduce === 'undefined') {
        throw errors_1.VAL_NOT_RGB_OBJ_ARRAY_ERROR;
    }
    if (totalPixels === 0) {
        throw errors_1.ZERO_PIXELS_FOUND_ERROR;
    }
    if (totalPixels === 1) {
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
exports.calcAverageColor = calcAverageColor;
