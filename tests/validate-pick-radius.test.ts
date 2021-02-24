import { ERROR_MSGS } from '../src/constants/errors'
import {
  MAXIMUM_PICK_RADIUS,
  MINIMUM_PICK_RADIUS,
  validatePickRadius
} from '../src/validatePickRadius'

describe('validatePickRadius should', () => {
  it(`throw if pick radius is less than ${MINIMUM_PICK_RADIUS}`, () => {
    expect(() => validatePickRadius(-5)).toThrow(ERROR_MSGS.validatePickRadius.pickRadiusOutOfBounds)
  })

  it(`throw if pick radius is more than ${MAXIMUM_PICK_RADIUS}`, () => {
    expect(() => validatePickRadius(460)).toThrow(ERROR_MSGS.validatePickRadius.pickRadiusOutOfBounds)
  })

  it('do nothing if pick radius is valid', () => {
    expect(validatePickRadius(200)).toBe(undefined)
  })
})
