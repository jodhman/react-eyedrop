import { RgbObj } from './types'

export const parseRGB = ({ r, g, b }: RgbObj): string => `rgb(${r}, ${g}, ${b})`
