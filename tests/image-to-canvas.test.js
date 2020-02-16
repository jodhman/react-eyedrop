import React from 'react'
import { ERROR_MSGS } from '../src/constants/errors'
import { imageToCanvas } from '../src/image-to-canvas'

describe('imageToCanvas should', () => {
  it('return a canvas based on image', () => {
    const imgElement = document.createElement('img')
    expect(imageToCanvas(imgElement)).toMatchSnapshot()
  })
  
  it('throw if event target is NOT of node type img', () => {
    const divElement = document.createElement('div')
    expect(() => imageToCanvas(divElement)).toThrow(ERROR_MSGS.imageToCanvas.targetNotImg)
  })
})