import { validateCanvasExtractionValues } from '../src/validations/validateCanvasExtractionValues'

describe('validateCanvasExtractionValues should', () => {
  describe('return adjusted extraction values if value if out of bounds', () => {
    let mockExtractionValues
    beforeEach(() => {
      mockExtractionValues = {
        x: 5,
        y: 5,
        targetHeight: 10,
        targetWidth: 15,
        canvasHeight: 120,
        canvasWidth: 120
      }
    })

    it('y', () => {
      mockExtractionValues.y = -10
      expect(validateCanvasExtractionValues(mockExtractionValues)).toEqual({
        ...mockExtractionValues,
        y: 0
      })
    })

    it('x', () => {
      mockExtractionValues.x = -10
      expect(validateCanvasExtractionValues(mockExtractionValues)).toEqual({
        ...mockExtractionValues,
        x: 0
      })
    })

    it('targetWidth', () => {
      mockExtractionValues.canvasWidth = 15
      mockExtractionValues.x = 10
      expect(validateCanvasExtractionValues(mockExtractionValues)).toEqual({
        ...mockExtractionValues,
        targetWidth: 5
      })
    })

    it('targetHeight', () => {
      mockExtractionValues.canvasHeight = 15
      mockExtractionValues.y = 10
      expect(validateCanvasExtractionValues(mockExtractionValues)).toEqual({
        ...mockExtractionValues,
        targetHeight: 5
      })
    })
  })
})
