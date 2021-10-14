interface CanvasContext extends CanvasRenderingContext2D {
  mozImageSmoothingEnabled: boolean;
  msImageSmoothingEnabled: boolean;
  webkitImageSmoothingEnabled: boolean;
}

export const getColorFromMousePosition = (
  event: any,
  magnifier: any,
  targetRect: any,
  zoom: number
) => {
  if (!targetRect) {
    return;
  }
  const { clientX, clientY } = event;
  const { scrollX, scrollY } = magnifier.ownerDocument.defaultView;
  const canvas = magnifier.querySelector('canvas');
  const context = canvas && canvas.getContext('2d');
  const { left, top } = targetRect;
  const x = (clientX + scrollX - left) * 2 - zoom;
  const y = (clientY + scrollY - top) * 2 - zoom;
  const pixels = context && context.getImageData(x, y, 1, 1).data;

  return (
    pixels &&
    '#' + ('000000' + rgbToHex(pixels[0], pixels[1], pixels[2])).slice(-6)
  );
};

export const getSyncedPosition = (
  magnifier: any,
  targetRect: any,
  size: number,
  zoom: number
) => {
  if (!targetRect) {
    return { top: 0, left: 0 };
  }
  const { left, top } = targetRect;
  const x1 = magnifier.offsetLeft - left + size / 4 + zoom * 4;
  const y1 = magnifier.offsetTop - top + size / 4 + zoom * 4;
  const currentWindow = magnifier.ownerDocument.defaultView;
  const x2 = currentWindow.pageXOffset;
  const y2 = currentWindow.pageYOffset;
  const left1 = -x1 * zoom - x2 * zoom;
  const top1 = -y1 * zoom - y2 * zoom;

  return {
    left: left1,
    top: top1,
  };
};

export const isDescendant = (parent, child) => {
  let node = child;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

export const isMouseMovingOut = (mouseEvent, targetRect) => {
  const { clientX, clientY } = mouseEvent;
  const { left, top, width, height } = targetRect;

  return (
    clientX <= left ||
    clientY <= top ||
    clientX >= left + width ||
    clientY >= top + height
  );
};

export const pixelateCanvas = (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  pixelateValue: number
) => {
  canvas.height = image.height;
  canvas.width = image.width;
  const ctx = canvas.getContext('2d') as CanvasContext;
  const fw = Math.floor(image.width / pixelateValue);
  const fh = Math.floor(image.height / pixelateValue);
  ctx.imageSmoothingEnabled =
    ctx.mozImageSmoothingEnabled =
    ctx.msImageSmoothingEnabled =
    ctx.webkitImageSmoothingEnabled =
      false;

  ctx.drawImage(image, 0, 0, fw, fh);
  ctx.drawImage(canvas, 0, 0, fw, fh, 0, 0, image.width, image.height);
};

export const rgbToHex = (r: number, g: number, b: number) => {
  const componentToHex = (c: number) => {
    const hex = (+c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const setUpMagnifier = (magnifier, magnifierContent) => {
  magnifierContent.innerHTML = '';

  const { ownerDocument } = magnifier;
  const bodyOriginal = ownerDocument.body;
  const color = bodyOriginal.style.backgroundColor;
  magnifier.style.backgroundColor = color;
};
