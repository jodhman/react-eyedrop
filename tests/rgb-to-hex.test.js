import { rgbToHex } from '../src/rgb-to-hex'

describe('rgbToHex should', () => {
  describe('convert a rgb object to hex code:', () => {
    it('black', () => {
      const black = {
        r: 0,
        g: 0,
        b: 0
      }
      expect(rgbToHex(black)).toBe('#000000')
    })
    
    it('white', () => {
      const black = {
        r: 255,
        g: 255,
        b: 255
      }
      expect(rgbToHex(black)).toBe('#ffffff')
    })
  })
})