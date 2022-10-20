import * as React from 'react';
import { parseRGB } from './colorUtils/parseRgb';
import { rgbToHex } from './colorUtils/rgbToHex';
import { OnChangeEyedrop, RgbObj, PickingMode } from './types';
import { validatePickRadius } from './validations/validatePickRadius';
import { targetToCanvas } from './targetToCanvas'
import { getColor } from './getColor'

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
    onPickStart,
    onPickEnd,
  } = props;

  const setPickingMode = useCallback(({ isPicking, disableButton, showActiveCursor }: PickingMode) => {
    if(document.body) {
      document.body.style.cursor = showActiveCursor ? cursorActive : cursorInactive;
    }
    setButtonDisabled(disableButton);
    window.setTimeout(() => {
      setPickingColorFromDocument(isPicking);
    }, 250)
  }, [cursorActive, cursorInactive]);

  const deactivateColorPicking = useCallback(
    () => {
      setPickingMode({
        isPicking: false,
        disableButton: false,
        showActiveCursor: false
      })
      onPickEnd && onPickEnd()
    }, [setPickingMode, onPickEnd]
  );

  const exitPickByEscKey = useCallback((event: KeyboardEvent) => {
    event.code === 'Escape' && pickingColorFromDocument && deactivateColorPicking()
  }, [pickingColorFromDocument, deactivateColorPicking]);

  const pickColor = () => {
    if (onPickStart) { onPickStart(); }

    setPickingMode({
      isPicking: true,
      disableButton: disabled || true,
      showActiveCursor: true
    });
  };

  const updateColors = useCallback((rgbObj: RgbObj) => {
    const rgb = parseRGB(rgbObj);
    const hex = rgbToHex(rgbObj);

    // set color object to parent handler
    onChange({ rgb, hex, customProps });

    setColors({ rgb, hex });
  }, [customProps, onChange]);

  const extractColor = useCallback(async (e: MouseEvent) => {
    const { target } = e

    if(!target) return
    const targetCanvas = await targetToCanvas(target)
    const rgbColor = getColor(targetCanvas, e, pickRadius)

    updateColors(rgbColor)
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
    return () => {
      if(document.body) {
        document.body.style.cursor = cursorInactive
      }
    }
  }, [])

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
