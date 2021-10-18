export const isMouseMovingOut = (mouseEvent, targetRect) => {
  const { clientX, clientY } = mouseEvent
  const { left, top, width, height } = targetRect

  return (
    clientX <= left ||
    clientY <= top ||
    clientX >= left + width ||
    clientY >= top + height
  )
}
