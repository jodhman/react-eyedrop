"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractColors = void 0;
const getCanvasBlockColors_1 = require("./getCanvasBlockColors");
const extractColors = (canvas, pickRadius, x, y) => {
    const startingX = x - pickRadius;
    const startingY = y - pickRadius;
    const pickWidth = pickRadius * 2;
    const pickHeight = pickRadius * 2;
    return getCanvasBlockColors_1.getCanvasBlockColors(canvas, startingX, startingY, pickWidth, pickHeight);
};
exports.extractColors = extractColors;
