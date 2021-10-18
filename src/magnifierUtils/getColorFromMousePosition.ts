import { rgbToHex } from '../colorUtils/rgbToHex'

export const getColorFromMousePosition = (
  event: any,
  magnifier: any,
  targetRect: any,
  zoom: number
) => {
  if (!targetRect) {
    return
  }
  const { clientX, clientY } = event
  const { scrollX, scrollY } = magnifier.ownerDocument.defaultView
  const canvas = magnifier.querySelector('canvas')
  const context = canvas && canvas.getContext('2d')
  const { left, top } = targetRect
  const x = (clientX + scrollX - left) * 2 - zoom
  const y = (clientY + scrollY - top) * 2 - zoom
  const pixels = context && context.getImageData(x, y, 1, 1).data

  return (
    pixels &&
    '#' + ('000000' + rgbToHex({ r: pixels[ 0 ], g: pixels[ 1 ], b: pixels[ 2 ] })).slice(-6)
  )
}
