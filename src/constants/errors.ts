export const ERROR_MSGS = {
  calcAverageColor: {
    notArrayOfRgbObj: 'calcAverageColor: only accepts array of colors',
    noPixelsFound: 'calcAverageColor: 0 pixels found'
  },
  getCanvasBlockColors: {
    elementNotCanvas: 'getCanvasBlockColors: element is not of type canvas'
  },
  targetToCanvas: {
    targetNotElement: 'targetToCanvas: event target not HTML element'
  },
  imageToCanvas: {
    targetNotImg: 'imageToCanvas: event target not of node type img'
  },
  validatePickRadius: {
    pickRadiusOutOfBounds: 'Property `pickRadius` out of bounds: please choose a value between 0 - 450.'
  }
};

export const PICK_RADIUS_OUT_OF_BOUNDS_ERROR = new Error(ERROR_MSGS.validatePickRadius.pickRadiusOutOfBounds);

export const TARGET_NODE_TYPE_NOT_IMG_ERROR = new Error(ERROR_MSGS.imageToCanvas.targetNotImg);

export const TARGET_NOT_HTML_ELEMENT_ERROR = new Error(ERROR_MSGS.targetToCanvas.targetNotElement);

export const VAL_NOT_RGB_OBJ_ARRAY_ERROR = new Error(ERROR_MSGS.calcAverageColor.notArrayOfRgbObj);

export const ZERO_PIXELS_FOUND_ERROR = new Error(ERROR_MSGS.calcAverageColor.noPixelsFound);

export const ELEMENT_NOT_CANVAS_ERROR = new Error(ERROR_MSGS.getCanvasBlockColors.elementNotCanvas);
