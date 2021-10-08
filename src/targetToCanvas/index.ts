import { imageToCanvas } from './imageToCanvas'
import * as _html2canvas from 'html2canvas'

const html2canvas = _html2canvas as any as (element: HTMLElement, options?: Partial<_html2canvas.Options>) => Promise<HTMLCanvasElement>;

export const targetToCanvas = (target: any): Promise<HTMLCanvasElement> => {
  if(target.nodeName.toLowerCase() === 'img') {
    return imageToCanvas(target)
  }
  return html2canvas(target, { logging: false })
}
