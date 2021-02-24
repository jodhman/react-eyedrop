"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePickRadius = exports.MAXIMUM_PICK_RADIUS = exports.MINIMUM_PICK_RADIUS = void 0;
const errors_1 = require("./constants/errors");
exports.MINIMUM_PICK_RADIUS = 0;
exports.MAXIMUM_PICK_RADIUS = 450;
const validatePickRadius = (pickRadius) => {
    if (pickRadius < exports.MINIMUM_PICK_RADIUS || pickRadius > exports.MAXIMUM_PICK_RADIUS) {
        throw errors_1.PICK_RADIUS_OUT_OF_BOUNDS_ERROR;
    }
};
exports.validatePickRadius = validatePickRadius;
