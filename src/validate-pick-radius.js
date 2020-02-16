// @flow

import { PICK_RADIUS_OUT_OF_BOUNDS_ERROR } from './constants/errors'

export const MINIMUM_PICK_RADIUS = 0
export const MAXIMUM_PICK_RADIUS = 450

export const validatePickRadius = (pickRadius: number) => {
  if (pickRadius < MINIMUM_PICK_RADIUS || pickRadius > MAXIMUM_PICK_RADIUS) {
    throw PICK_RADIUS_OUT_OF_BOUNDS_ERROR
  }
}