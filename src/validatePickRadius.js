// @flow

const MINIMUM = 0
const MAXIMUM = 450
const ERROR_TEXT = 'Property `pickRadius` out of bounds: please choose a value between 0 - 450.'

export const validatePickRadius = (pickRadius: number) => {
  if (pickRadius < MINIMUM || pickRadius > MAXIMUM) {
    throw new Error(ERROR_TEXT)
  }
}