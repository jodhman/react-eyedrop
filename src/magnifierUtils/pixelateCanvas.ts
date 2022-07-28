interface CanvasContext extends CanvasRenderingContext2D {
  mozImageSmoothingEnabled: boolean
  msImageSmoothingEnabled: boolean
  webkitImageSmoothingEnabled: boolean
}

export const pixelateCanvas = (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  pixelateValue: number
) => {
  canvas.height = image.height
  canvas.width = image.width
  const ctx = canvas.getContext('2d') as CanvasContext
  const fw = Math.floor(image.width / pixelateValue)
  const fh = Math.floor(image.height / pixelateValue)
  ctx.imageSmoothingEnabled =
    ctx.mozImageSmoothingEnabled =
      ctx.msImageSmoothingEnabled =
        ctx.webkitImageSmoothingEnabled =
          false

  ctx.drawImage(image, 0, 0, fw, fh)
  ctx.drawImage(canvas, 0, 0, fw, fh, 0, 0, image.width, image.height)
}
