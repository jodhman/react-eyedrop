"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgbToHex = void 0;
const numberToHex = (rgb) => {
    let hex = rgb.toString(16);
    if (hex.length < 2) {
        hex = `0${hex}`;
    }
    return hex;
};
const rgbToHex = (rgbObj) => {
    const { r, g, b } = rgbObj;
    const red = numberToHex(r);
    const green = numberToHex(g);
    const blue = numberToHex(b);
    return `#${red}${green}${blue}`;
};
exports.rgbToHex = rgbToHex;
