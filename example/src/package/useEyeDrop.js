"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEyeDrop = void 0;
const React = require("react");
const getCanvasPixelColor = require("get-canvas-pixel-color");
const _html2canvas = require("html2canvas");
const imageToCanvas_1 = require("./imageToCanvas");
const extractColors_1 = require("./extractColors");
const calcAverageColor_1 = require("./calcAverageColor");
const parseRgb_1 = require("./parseRgb");
const rgbToHex_1 = require("./rgbToHex");
const { useEffect, useState } = React;
const html2canvas = _html2canvas;
const initialStateColors = { rgb: '', hex: '' };
const useEyeDrop = ({ once, pickRadius, cursorActive = 'copy', cursorInactive = 'auto', } = {}) => {
    const [colors, setColors] = useState(initialStateColors);
    const [pickingColorFromDocument, setPickingColorFromDocument] = useState(false);
    const pickColor = () => {
        setPickingColorFromDocument(true);
    };
    const updateColors = (rgbObj) => {
        const rgb = parseRgb_1.parseRGB(rgbObj);
        const hex = rgbToHex_1.rgbToHex(rgbObj);
        setColors({ rgb, hex });
    };
    const targetToCanvas = (e) => {
        const { target } = e;
        if (target.nodeName.toLowerCase() === 'img') {
            // Convert image to canvas because `html2canvas` can not
            const { offsetX, offsetY } = e;
            imageToCanvas_1.imageToCanvas(target).then((value) => {
                const { r, g, b } = getCanvasPixelColor(value, offsetX, offsetY);
                updateColors({ r, g, b });
                once && setPickingColorFromDocument(false);
            });
            return;
        }
        const { offsetX, offsetY } = e;
        html2canvas(target, { logging: false })
            .then((canvasEl) => {
            if (pickRadius === undefined || pickRadius === 0) {
                const { r, g, b } = getCanvasPixelColor(canvasEl, offsetX, offsetY);
                updateColors({ r, g, b });
            }
            else {
                const colorBlock = extractColors_1.extractColors(canvasEl, pickRadius, offsetX, offsetY);
                const rgbColor = calcAverageColor_1.calcAverageColor(colorBlock);
                updateColors(rgbColor);
            }
        });
        once && setPickingColorFromDocument(false);
    };
    const cancelPickColor = () => {
        setPickingColorFromDocument(false);
    };
    useEffect(() => {
        if (pickingColorFromDocument) {
            document.addEventListener('click', targetToCanvas);
        }
        return () => {
            if (once || pickingColorFromDocument) {
                document.removeEventListener('click', targetToCanvas);
            }
        };
    }, [pickingColorFromDocument, once]);
    useEffect(() => {
        if (document.body) {
            document.body.style.cursor = pickingColorFromDocument ? cursorActive : cursorInactive;
        }
    }, [pickingColorFromDocument]);
    return [colors, pickColor, cancelPickColor];
};
exports.useEyeDrop = useEyeDrop;
