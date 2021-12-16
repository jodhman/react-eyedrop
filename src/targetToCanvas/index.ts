import { imageToCanvas } from './imageToCanvas'
import * as _html2canvas from 'html2canvas'
import { TARGET_NOT_HTML_ELEMENT_ERROR } from '../constants/errors'
import { elementToCanvas } from './elementToCanvas'

const html2canvas = _html2canvas as any as (element: HTMLElement, options?: Partial<_html2canvas.Options>) => Promise<HTMLCanvasElement>;

export const targetToCanvas = (target: EventTarget): Promise<HTMLCanvasElement> => {
  if(!(target instanceof HTMLElement)) {
    throw TARGET_NOT_HTML_ELEMENT_ERROR
  }
  if(target instanceof HTMLImageElement) {
    return imageToCanvas(target)
  }
  if(window.getComputedStyle(target).backgroundImage) {
    return elementToCanvas(target)
  }
  return html2canvas(target, { logging: false })
}
