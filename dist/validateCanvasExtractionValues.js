"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCanvasExtractionValues = void 0;
const validateCanvasExtractionValues = (extractionValues) => {
    // do not compute data if they're out of canvas area
    const { x, y, targetHeight, targetWidth, canvasHeight, canvasWidth } = extractionValues;
    const newExtractionValues = Object.assign({}, extractionValues);
    if (x < 0) {
        newExtractionValues.x = 0;
    }
    if (y < 0) {
        newExtractionValues.y = 0;
    }
    if (x + targetWidth > canvasWidth) {
        newExtractionValues.targetWidth = canvasWidth - x;
    }
    if (y + targetHeight > canvasHeight) {
        newExtractionValues.targetHeight = canvasHeight - y;
    }
    return newExtractionValues;
};
exports.validateCanvasExtractionValues = validateCanvasExtractionValues;
