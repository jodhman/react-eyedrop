// @flow

export const imageToCanvas = (eventTarget: HTMLImageElement) => {
  if(eventTarget.nodeName !== 'IMG') {
    throw new Error('imageToCanvas: event target not of node type img')
  }
  const canvasElement = document.createElement('canvas')
  canvasElement.width = eventTarget.width
  canvasElement.height = eventTarget.height
  const context = canvasElement.getContext('2d')
  context.drawImage(eventTarget, 0, 0, eventTarget.width, eventTarget.height)
  return canvasElement
}