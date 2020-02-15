// @flow

export const imageToCanvas = (eventTarget: *) => {
  const canvasElement = document.createElement('canvas')
  canvasElement.width = eventTarget.width
  canvasElement.height = eventTarget.height
  const context = canvasElement.getContext('2d')
  context.drawImage(eventTarget, 0, 0, eventTarget.width, eventTarget.height)
  return canvasElement
}