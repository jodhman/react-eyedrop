"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageToCanvas = void 0;
const errors_1 = require("./constants/errors");
const imageToCanvas = (eventTarget) => {
    if (eventTarget.nodeName !== 'IMG') {
        throw errors_1.TARGET_NODE_TYPE_NOT_IMG_ERROR;
    }
    return new Promise((resolve) => {
        const canvasElement = document.createElement('canvas');
        canvasElement.width = eventTarget.width;
        canvasElement.height = eventTarget.height;
        const context = canvasElement.getContext('2d');
        // Allows for cross origin images
        const handleLoad = () => {
            context.drawImage(downloadedImg, 0, 0, eventTarget.width, eventTarget.height);
            resolve(canvasElement);
        };
        const imageURL = eventTarget.src;
        let downloadedImg = new Image();
        downloadedImg.width = eventTarget.width;
        downloadedImg.height = eventTarget.height;
        downloadedImg.crossOrigin = 'Anonymous';
        downloadedImg.addEventListener('load', handleLoad);
        downloadedImg.src = imageURL;
    });
};
exports.imageToCanvas = imageToCanvas;
