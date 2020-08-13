// @flow

import { TARGET_NODE_TYPE_NOT_IMG_ERROR } from './constants/errors'

export const imageToCanvas = (eventTarget: HTMLImageElement) => {
  if(eventTarget.nodeName !== 'IMG') {
    throw TARGET_NODE_TYPE_NOT_IMG_ERROR
  }
  const canvasElement = document.createElement('canvas')
  canvasElement.width = eventTarget.width
  canvasElement.height = eventTarget.height
  const context = canvasElement.getContext('2d')

  // Allows for cross origin images
  const imageURL = eventTarget.src
  let downloadedImg = new Image
  downloadedImg.crossOrigin = "Anonymous"
  downloadedImg.src = imageURL

  context.drawImage(downloadedImg, 0, 0, eventTarget.width, eventTarget.height)
  return canvasElement
}