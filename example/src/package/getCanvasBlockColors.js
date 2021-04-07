"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCanvasBlockColors = void 0;
const errors_1 = require("./constants/errors");
const validateCanvasExtractionValues_1 = require("./validateCanvasExtractionValues");
const getCanvasBlockColors = (canvas, x, y, width, height) => {
    if (!canvas.getContext) {
        throw errors_1.ELEMENT_NOT_CANVAS_ERROR;
    }
    const ctx = canvas.getContext('2d');
    const validatedExtractionValues = validateCanvasExtractionValues_1.validateCanvasExtractionValues({
        x,
        y,
        targetHeight: height,
        targetWidth: width,
        canvasHeight: canvas.height,
        canvasWidth: canvas.width
    });
    const imageData = ctx.getImageData(validatedExtractionValues.x, validatedExtractionValues.y, validatedExtractionValues.targetWidth, validatedExtractionValues.targetHeight).data;
    const colorBlock = [];
    for (let i = 0; i < imageData.length; i += 4) {
        const color = imageData.slice(i, i + 4);
        colorBlock.push({
            r: color[0],
            g: color[1],
            b: color[2]
        });
    }
    return colorBlock;
};
exports.getCanvasBlockColors = getCanvasBlockColors;
