// @flow

export const MINIMUM_PICK_RADIUS = 0
export const MAXIMUM_PICK_RADIUS = 450
const ERROR_TEXT = 'Property `pickRadius` out of bounds: please choose a value between 0 - 450.'

export const validatePickRadius = (pickRadius: number) => {
  if (pickRadius < MINIMUM_PICK_RADIUS || pickRadius > MAXIMUM_PICK_RADIUS) {
    throw new Error(ERROR_TEXT)
  }
}