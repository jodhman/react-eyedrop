import {
  MAXIMUM_PICK_RADIUS,
  MINIMUM_PICK_RADIUS,
  validatePickRadius
} from '../src/validate-pick-radius'

describe('validatePickRadius should', () => {
  it(`throw if pick radius is less than ${MINIMUM_PICK_RADIUS}`, () => {
    expect(() => validatePickRadius(-5)).toThrow('Property `pickRadius` out of bounds: please choose a value between 0 - 450.')
  })
  
  it(`throw if pick radius is more than ${MAXIMUM_PICK_RADIUS}`, () => {
    expect(() => validatePickRadius(460)).toThrow('Property `pickRadius` out of bounds: please choose a value between 0 - 450.')
  })
})