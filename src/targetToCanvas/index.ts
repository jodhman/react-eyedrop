import { imageToCanvas } from './imageToCanvas'
import * as _html2canvas from 'html2canvas'
import { TARGET_NOT_HTML_ELEMENT_ERROR } from '../constants/errors'
import { elementToCanvas } from './elementToCanvas'

const html2canvas = _html2canvas as any as (element: HTMLElement, options?: Partial<_html2canvas.Options>) => Promise<HTMLCanvasElement>;

export const targetToCanvas = async (_target: HTMLElement): Promise<{
  targetCanvas: HTMLCanvasElement,
  targetPickXOffset: number,
  targetPickYOffset: number
}> => {
  let target = _target;

  // Remember original target element position
  let originalClientTop = target.getBoundingClientRect().top;
  let originalClientLeft = target.getBoundingClientRect().left;

  // Make sure svg color picking work
  for (let i = 0; i < 20; i++) {
      if ((target instanceof HTMLElement)) {
          break;
      }
      target = (target as HTMLElement)?.parentElement;

      // Element inside svg ex. path, will have target.offset(X|Y) referenced from outer svg tag not the path itself
      // This will make sure we got correct target pixel on svg element 
      if (target.tagName === 'svg') {
        originalClientTop = target.getBoundingClientRect().top;
        originalClientLeft = target.getBoundingClientRect().left;
      }
  }

  if(!(target instanceof HTMLElement)) {
    throw TARGET_NOT_HTML_ELEMENT_ERROR
  }

  // Compute offset after if target element position is changed
  const newClientTop = target.getBoundingClientRect().top;
  const newClientLeft = target.getBoundingClientRect().left;

  let targetPickXOffset = 0;
  let targetPickYOffset = 0;
  if (originalClientLeft > newClientLeft) {
      targetPickXOffset = originalClientLeft - newClientLeft;
  }
  if (originalClientTop > newClientTop) {
      targetPickYOffset = originalClientTop - newClientTop;
  }

  if(target instanceof HTMLImageElement) {
    // This approach is not workable with transparent image, but it is tradeoff for better performance
    const targetCanvas = await imageToCanvas(target)
    return {
      targetCanvas,
      targetPickXOffset,
      targetPickYOffset
    }
  }

  // This approach is not workable with transparent image
  const targetBackgroundImage = window.getComputedStyle(target).backgroundImage
  // Make sure the backgroundImage to use in process must have url('') because it will have problem with gradient such as linear('')
  // Also it is not gonna work with multiple url(''), url('') pattern, but it is tradeoff for better performance
  if(targetBackgroundImage && targetBackgroundImage !== 'none' && targetBackgroundImage.startsWith('url(')) {
    const targetCanvas = await elementToCanvas(target)
    return {
      targetCanvas,
      targetPickXOffset,
      targetPickYOffset
    }
  }

  // Make sure to have 1:1 scale so that it will pick correct color
  const targetCanvas = await html2canvas(target, { logging: false, scale: 1 })
  return {
    targetCanvas,
    targetPickXOffset,
    targetPickYOffset
  }
}