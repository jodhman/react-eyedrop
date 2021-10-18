import * as React from 'react';
import * as _html2canvas from 'html2canvas';
const html2canvas = _html2canvas as any as (element: HTMLElement, options?: Partial<_html2canvas.Options>) => Promise<HTMLCanvasElement>;
import { useRef } from 'react';

import { parseRGB } from './colorUtils/parseRgb';
import { rgbToHex } from './colorUtils/rgbToHex';
import { OnChangeEyedrop, RgbObj, PickingMode, TargetRef } from './types';
import { validatePickRadius } from './validations/validatePickRadius';
import { targetToCanvas } from './targetToCanvas';
import { getColor } from './getColor';
import { Magnifier } from './magnifier';
import { hexToRgb } from './colorUtils/hexToRgb'

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
  onPickEnd?: () => void,
  colorsPassThrough?: string,
  pickRadius?: number,
  disabled?: boolean,
  children?: React.ReactNode,
  customProps?: { [key: string]: any },
  isMagnifiedPicker?: boolean
  zoom?: number,
  pixelateValue?: number,
  magnifierSize?: number,
  areaSelector?: string,
}

const initialStateColors = { rgb: '', hex: '' };

export const EyeDropper = (props: Props) => {
  const [colors, setColors] = useState(initialStateColors);
  const [pickingColorFromDocument, setPickingColorFromDocument] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [active, setActive] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const eyeDropperRef = useRef(document.createElement('div'));
  const target = useRef<TargetRef>({} as TargetRef);
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
    onPickStart,
    onPickEnd,
    isMagnifiedPicker = false,
    pixelateValue = 6,
    magnifierSize = 150,
    zoom = 5,
    areaSelector = 'body',
  } = props;

  const setPickingMode = useCallback(({ isPicking, disableButton, showActiveCursor }: PickingMode) => {
    if(document.body) {
      document.body.style.cursor = showActiveCursor ? cursorActive : cursorInactive;
    }
    setPickingColorFromDocument(isPicking);
    setButtonDisabled(disableButton);
  }, [cursorActive, cursorInactive]);

  const deactivateColorPicking = useCallback(
    () => {
      setPickingMode({
        isPicking: false,
        disableButton: false,
        showActiveCursor: false
      });
      onPickEnd && onPickEnd();
    }, [setPickingMode, onPickEnd]
  );

  const exitPickByEscKey = useCallback((event: KeyboardEvent) => {
    event.code === 'Escape' && pickingColorFromDocument && deactivateColorPicking();
  }, [pickingColorFromDocument, deactivateColorPicking]);

  const pickColor = () => {
    if (onPickStart) { onPickStart(); }

    setPickingMode({
      isPicking: true,
      disableButton: disabled || true,
      showActiveCursor: true
    });
  };

  const activateMagnifier = () => {
    setActive(!active);
  };

  const setColorCallback = (hex: any) => {
    const rgbObj = hexToRgb(hex);
    const rgb = rgbObj && parseRGB(rgbObj);

    rgb && onChange({rgb, hex, customProps});
    setActive(false);
  };

  const updateColors = useCallback((rgbObj: RgbObj) => {
    const rgb = parseRGB(rgbObj);
    const hex = rgbToHex(rgbObj);

    // set color object to parent handler
    onChange({ rgb, hex, customProps });

    setColors({ rgb, hex });
  }, [customProps, onChange]);

  const extractColor = useCallback(async (e: MouseEvent) => {
    const { target } = e;

    const targetCanvas = target && await targetToCanvas(target);
    const rgbColor = targetCanvas && getColor(pickRadius, targetCanvas, e);

    rgbColor && updateColors(rgbColor);
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
      document.addEventListener('click', extractColor);
    }
    return () => {
      document.removeEventListener('click', extractColor);
    };
  }, [pickingColorFromDocument, once, extractColor]);

  // setup listener for the esc key
  useEffect(() => {
    if (pickingColorFromDocument) {
      document.addEventListener('keydown', exitPickByEscKey);
    }
    return () => {
      document.removeEventListener('keydown', exitPickByEscKey);
    };
  }, [pickingColorFromDocument, exitPickByEscKey]);

  useEffect(() => {
    if (active) {
      const targetEle = eyeDropperRef.current.ownerDocument.querySelector(
        areaSelector
      ) as HTMLElement;
      if (targetEle) {
        target.current = {
          element: targetEle,
          rect: targetEle.getBoundingClientRect(),
        };
      }
      html2canvas(target.current.element).then((generatedCanvas: any) => {
        setCanvas(generatedCanvas);
      });
    }
  }, [active]);

  const shouldColorsPassThrough = colorsPassThrough ? { [colorsPassThrough]: colors } : {};
  return (
    <div style={styles.eyedropperWrapper} className={wrapperClasses} ref={eyeDropperRef}>
      {CustomComponent ? (
        <CustomComponent
          onClick={isMagnifiedPicker ? activateMagnifier : pickColor}
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
            onClick={isMagnifiedPicker ? activateMagnifier : pickColor}
            disabled={buttonDisabled}
          >
            {children}
          </button>
        </>
      )}
      {isMagnifiedPicker && (
        <Magnifier
          active={active}
          canvas={canvas}
          zoom={zoom}
          pixelateValue={pixelateValue}
          magnifierSize={magnifierSize}
          setColorCallback={setColorCallback}
          target={target}
        />
      )}
    </div>
  );
};
