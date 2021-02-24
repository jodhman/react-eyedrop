"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELEMENT_NOT_CANVAS_ERROR = exports.ZERO_PIXELS_FOUND_ERROR = exports.VAL_NOT_RGB_OBJ_ARRAY_ERROR = exports.TARGET_NODE_TYPE_NOT_IMG_ERROR = exports.PICK_RADIUS_OUT_OF_BOUNDS_ERROR = exports.ERROR_MSGS = void 0;
exports.ERROR_MSGS = {
    calcAverageColor: {
        notArrayOfRgbObj: 'calcAverageColor: only accepts array of colors',
        noPixelsFound: 'calcAverageColor: 0 pixels found'
    },
    getCanvasBlockColors: {
        elementNotCanvas: 'getCanvasBlockColors: element is not of type canvas'
    },
    imageToCanvas: {
        targetNotImg: 'imageToCanvas: event target not of node type img'
    },
    validatePickRadius: {
        pickRadiusOutOfBounds: 'Property `pickRadius` out of bounds: please choose a value between 0 - 450.'
    }
};
exports.PICK_RADIUS_OUT_OF_BOUNDS_ERROR = new Error(exports.ERROR_MSGS.validatePickRadius.pickRadiusOutOfBounds);
exports.TARGET_NODE_TYPE_NOT_IMG_ERROR = new Error(exports.ERROR_MSGS.imageToCanvas.targetNotImg);
exports.VAL_NOT_RGB_OBJ_ARRAY_ERROR = new Error(exports.ERROR_MSGS.calcAverageColor.notArrayOfRgbObj);
exports.ZERO_PIXELS_FOUND_ERROR = new Error(exports.ERROR_MSGS.calcAverageColor.noPixelsFound);
exports.ELEMENT_NOT_CANVAS_ERROR = new Error(exports.ERROR_MSGS.getCanvasBlockColors.elementNotCanvas);
