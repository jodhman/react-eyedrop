// @flow

import type { RgbObj } from './types'

export const parseRGB = ({ r, g, b }: RgbObj) => `rgb(${r}, ${g}, ${b})`