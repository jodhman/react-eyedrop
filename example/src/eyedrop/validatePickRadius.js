// @flow

const MINIMUM = 0
const MAXIMUM = 450
const ERROR_TEXT = 'pickRadius out of range: 0-450'

export const validatePickRadius = (pickRadius: number) => {
  if (pickRadius < MINIMUM || pickRadius > MAXIMUM) {
    throw new Error(ERROR_TEXT)
  }
}