export const elementToCanvas = (element: HTMLElement): Promise<HTMLCanvasElement>  => {
  return new Promise<HTMLCanvasElement>((resolve) => {
    const canvasElement = document.createElement('canvas');
    const elementHeight = parseInt(window.getComputedStyle(element).height, 10)
    const elementWidth = parseInt(window.getComputedStyle(element).width, 10)

    canvasElement.width = elementWidth;
    canvasElement.height = elementHeight;
    const context = canvasElement.getContext('2d')!;

    // Allows for cross origin images
    const handleLoad = () => {
      context.drawImage(downloadedImg, 0, 0, downloadedImg.naturalWidth, downloadedImg.naturalHeight);
      resolve(canvasElement);
    };
    const src = window.getComputedStyle(element).backgroundImage
    const startPosition = src.indexOf('url(') + 5
    const imageURL = src.slice(startPosition, src.indexOf(')', startPosition) - 1);
    const downloadedImg = new Image();
    downloadedImg.width = elementWidth;
    downloadedImg.height = elementHeight;
    downloadedImg.crossOrigin = 'Anonymous';
    downloadedImg.addEventListener('load', handleLoad);
    downloadedImg.src = imageURL;
  })
}