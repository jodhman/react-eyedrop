import * as React from 'react';
import * as getCanvasPixelColor from 'get-canvas-pixel-color';
import * as html2canvas from 'html2canvas';
import { HookOptions, RgbObj } from './types';
import { imageToCanvas } from './imageToCanvas';
import { extractColors } from './extractColors';
import { calcAverageColor } from './calcAverageColor';
import { parseRGB } from './parseRgb';
import { rgbToHex } from './rgbToHex';

const { useEffect, useState } = React;

const initialStateColors = { rgb: '', hex: '' };

export const useEyeDrop = ({
	once,
	pickRadius,
	cursorActive = 'copy',
	cursorInactive = 'auto',
}: HookOptions = {}): [typeof initialStateColors, () => void, () => void] => {
	const [colors, setColors] = useState(initialStateColors);
	const [pickingColorFromDocument, setPickingColorFromDocument] = useState(false);

	const pickColor = () => {
		setPickingColorFromDocument(true);
	};

	const updateColors = (rgbObj: RgbObj) => {
		const rgb = parseRGB(rgbObj);
		const hex = rgbToHex(rgbObj);

		setColors({ rgb, hex });
	};

	const targetToCanvas = (e: any) => {
		const { target } = e;

		if(target.nodeName.toLowerCase() === 'img') {
			// Convert image to canvas because `html2canvas` can not
			const { offsetX, offsetY } = e;
			imageToCanvas(target).then((value) => {
				const { r, g, b } = getCanvasPixelColor(value, offsetX, offsetY);
				updateColors({ r, g, b });
				once && setPickingColorFromDocument(false);
			});
			return;
		}

		const { offsetX, offsetY } = e;
		html2canvas.default(target, { logging: false })
			.then((canvasEl) => {
				if (pickRadius === undefined || pickRadius === 0) {
					const { r, g, b } = getCanvasPixelColor.default(canvasEl, offsetX, offsetY);
					updateColors({ r, g, b });
				} else {
					const colorBlock = extractColors(canvasEl, pickRadius, offsetX, offsetY);
					const rgbColor = calcAverageColor(colorBlock);
					updateColors(rgbColor);
				}
			});

		once && setPickingColorFromDocument(false);
	};

	const cancelPickColor = () => {
		setPickingColorFromDocument(false);
	};

	useEffect(() => {
		if (pickingColorFromDocument) {
			document.addEventListener('click', targetToCanvas);
		}
		return () => {
			if (once || pickingColorFromDocument) {
				document.removeEventListener('click', targetToCanvas);
			}
		};
	}, [pickingColorFromDocument, once]);

	useEffect(() => {
		if(document.body) {
			document.body.style.cursor = pickingColorFromDocument ? cursorActive : cursorInactive;
		}
	}, [pickingColorFromDocument]);

	return [ colors, pickColor, cancelPickColor ];
};
