type ExtractionValues = {
  x: number,
  y: number,
  targetWidth: number,
  targetHeight: number,
  canvasWidth: number,
  canvasHeight: number
}

export const validateCanvasExtractionValues = (extractionValues: ExtractionValues) => {
	// do not compute data if they're out of canvas area
	const {
		x,
		y,
		targetHeight,
		targetWidth,
		canvasHeight,
		canvasWidth
	} = extractionValues;

	const newExtractionValues = { ...extractionValues };

	if (x < 0) { newExtractionValues.x = 0; }
	if (y < 0) { newExtractionValues.y = 0; }
	if (x + targetWidth > canvasWidth) { newExtractionValues.targetWidth = canvasWidth - x; }
	if (y + targetHeight > canvasHeight) { newExtractionValues.targetHeight = canvasHeight - y; }

	return newExtractionValues;
};
