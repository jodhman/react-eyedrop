import * as React from 'react';
import * as html2canvas from 'html2canvas';
import * as getCanvasPixelColor from 'get-canvas-pixel-color';
import { calcAverageColor } from './calcAverageColor';
import { extractColors } from './extractColors';
import { imageToCanvas } from './imageToCanvas';
import { parseRGB } from './parseRgb';
import { rgbToHex } from './rgbToHex';
import { OnChangeEyedrop, RgbObj } from './types';
import { validatePickRadius } from './validatePickRadius';

const {
	useCallback,
	useEffect,
	useState
} = React;

const styles = {
	eyedropperWrapper: {
		position: 'relative'
	},
	eyedropperWrapperButton: {
		backgroundColor: '#000000',
		color: '#ffffff',
		border: '1px solid #ffffff',
		borderRadius: '20%',
		padding: '10px 25px',
	}
} as const;

type Props = {
  onChange: (changes: OnChangeEyedrop) => void,
  wrapperClasses?: string,
  buttonClasses?: string,
  customComponent?: React.FC<any>,
  once?: boolean,
  cursorActive?: string,
  cursorInactive?: string,
  onInit?: () => void,
  onPickStart?: () => void,
  colorsPassThrough?: string,
  pickRadius?: number,
  disabled?: boolean,
  children?: React.ReactNode,
  customProps?: { [key: string]: any }
}

const initialStateColors = { rgb: '', hex: '' };

export const EyeDropper = (props: Props) => {
	const [colors, setColors] = useState(initialStateColors);
	const [pickingColorFromDocument, setPickingColorFromDocument] = useState(false);
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const {
		once = true,
		pickRadius = 0,
		onInit,
		cursorActive = 'copy',
		cursorInactive = 'auto',
		onChange,
		wrapperClasses,
		buttonClasses,
		customComponent: CustomComponent,
		colorsPassThrough,
		children,
		customProps,
		disabled,
		onPickStart
	} = props;

	const setPickingMode = useCallback((isPicking: boolean, disableButton: boolean, showActiveCursor: boolean) => {
		if(document.body) {
			document.body.style.cursor = showActiveCursor ? cursorActive : cursorInactive;
		}
		setPickingColorFromDocument(isPicking);
		setButtonDisabled(disableButton);
	}, [cursorActive, cursorInactive]);

	const exitPick = useCallback((event: KeyboardEvent) => event.keyCode === 27 && (
		setPickingMode(false, false, false)
	), [setPickingMode]);

	const pickColor = () => {
		if (onPickStart) { onPickStart(); }

		setPickingMode(true, disabled || true, true);
	};

	const deactivateColorPicking = useCallback(
		() => setPickingMode(false, false, false), [setPickingMode]
	);

	const updateColors = useCallback((rgbObj: RgbObj) => {
		const rgb = parseRGB(rgbObj);
		const hex = rgbToHex(rgbObj);

		// set color object to parent handler
		onChange({ rgb, hex, customProps });

		setColors({ rgb, hex });
	}, [customProps, onChange]);

	const targetToCanvas = useCallback((e: any) => {
		const { target } = e;

		if(target.nodeName.toLowerCase() === 'img') {
			// Convert image to canvas because `html2canvas` can not
			const { offsetX, offsetY } = e;
			imageToCanvas(target).then((value) => {
				const { r, g, b } = getCanvasPixelColor.default(value, offsetX, offsetY);
				updateColors({ r, g, b });
				once && deactivateColorPicking();
			});
			return;
		}

		const { offsetX, offsetY } = e;
		(html2canvas as any).default(target, { logging: false }).then((canvasEl) => {
			if (pickRadius === undefined || pickRadius === 0) {
				const { r, g, b } = getCanvasPixelColor(canvasEl, offsetX, offsetY);
				updateColors({ r, g, b });
			} else {
				const colorBlock = extractColors(canvasEl, pickRadius, offsetX, offsetY);
				const rgbColor = calcAverageColor(colorBlock);
				updateColors(rgbColor);
			}
		});

		once && deactivateColorPicking();
	}, [deactivateColorPicking, once, pickRadius, updateColors]);

	useEffect(() => {
		onInit && onInit();
	}, [onInit]);

	useEffect(() => {
		pickRadius && validatePickRadius(pickRadius);
	}, [pickRadius]);

	// setup listener for canvas picking click
	useEffect(() => {
		if (pickingColorFromDocument) {
			document.addEventListener('click', targetToCanvas);
		}
		return () => {
			if (once || pickingColorFromDocument) {
				document.removeEventListener('click', targetToCanvas);
			}
		};
	}, [pickingColorFromDocument, once, targetToCanvas]);

	// setup listener for the esc key
	useEffect(() => {
		document.addEventListener('keydown', exitPick);
		return () => {
			document.removeEventListener('keydown', exitPick);
		};
	}, [exitPick]);

	const shouldColorsPassThrough = colorsPassThrough ? { [colorsPassThrough]: colors } : {};
	return (
		<div style={styles.eyedropperWrapper} className={wrapperClasses}>
			{CustomComponent ? (
				<CustomComponent
					onClick={pickColor}
					{...shouldColorsPassThrough}
					customProps={customProps}
					disabled={buttonDisabled}
				/>
			) : (
				<>
					<style dangerouslySetInnerHTML={{__html: `
            .react-eyedrop-button {
              background-color: #000000;
              color: #ffffff;
              border: 1px solid #ffffff;
              border-radius: 20%;
              padding: 10px 25px;
            }
          `}} />
					<button
						id={'react-eyedrop-button'}
						className={`react-eyedrop-button ${buttonClasses || ''}`}
						onClick={pickColor}
						disabled={buttonDisabled}
					>
						{children}
					</button>
				</>
			)}
		</div>
	);
};
