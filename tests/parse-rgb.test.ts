import { parseRGB } from '../src/colorUtils/parseRgb'

describe('parseRGB should', () => {
  describe('convert a rbg object to usable rgb string:', () => {
    it('black', () => {
      const black = {
        r: 0,
        g: 0,
        b: 0
      }
      expect(parseRGB(black)).toBe('rgb(0, 0, 0)')
    })

    it('white', () => {
      const white = {
        r: 255,
        g: 255,
        b: 255
      }
      expect(parseRGB(white)).toBe('rgb(255, 255, 255)')
    })
  })
})
