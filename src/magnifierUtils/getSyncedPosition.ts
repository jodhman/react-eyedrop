export const getSyncedPosition = (
  magnifier: any,
  targetRect: any,
  size: number,
  zoom: number
) => {
  if (!targetRect) {
    return { top: 0, left: 0 }
  }
  const { left, top } = targetRect
  const x1 = magnifier.offsetLeft - left + size / 4 + zoom * 4
  const y1 = magnifier.offsetTop - top + size / 4 + zoom * 4
  const currentWindow = magnifier.ownerDocument.defaultView
  const x2 = currentWindow.scrollX
  const y2 = currentWindow.scrollY
  const left1 = -x1 * zoom - x2 * zoom
  const top1 = -y1 * zoom - y2 * zoom

  return {
    left: left1,
    top: top1,
  }
}
