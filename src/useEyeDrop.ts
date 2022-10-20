import * as React from 'react';
import { HookOptions, RgbObj } from './types';
import { parseRGB } from './colorUtils/parseRgb';
import { rgbToHex } from './colorUtils/rgbToHex';
import { targetToCanvas } from './targetToCanvas'
import { getColor } from './getColor'
import { useCallback } from 'react'

const { useEffect, useState } = React;

const initialStateColors = { rgb: '', hex: '' };

type ReturnValue = [ typeof initialStateColors, () => void, () => void ]

export const useEyeDrop = ({
  once,
  pickRadius,
  cursorActive = 'copy',
  cursorInactive = 'auto',
  customProps,
  onPickStart,
  onPickEnd,
  onPickCancel,
  onChange,
}: HookOptions = {}): ReturnValue => {
  const [colors, setColors] = useState(initialStateColors);
  const [pickingColorFromDocument, setPickingColorFromDocument] = useState(false);

  const pickColor = () => {
    if (onPickStart) { onPickStart() }

    setPickingColorFromDocument(true);
  };

  const cancelPickColor = () => {
    if (onPickCancel) { onPickCancel() }

    setPickingColorFromDocument(false);
  };

  const exitPickByEscKey = useCallback((event: KeyboardEvent) => {
    event.code === 'Escape' && pickingColorFromDocument && cancelPickColor()
  }, [ pickingColorFromDocument, cancelPickColor ])

  const updateColors = (rgbObj: RgbObj) => {
    const rgb = parseRGB(rgbObj);
    const hex = rgbToHex(rgbObj);

    setColors({ rgb, hex });
  };

  const extractColor = useCallback(async (e: MouseEvent) => {
    const { target } = e;

    if(!target) return
    const targetCanvas = await targetToCanvas(target)
    const rgbColor = getColor(targetCanvas, e, pickRadius)

    if (onChange) {
      const rgb = parseRGB(rgbColor)
      const hex = rgbToHex(rgbColor)

      // set color object to parent handler
      onChange({ rgb, hex, customProps })
    }

    updateColors(rgbColor)
    once && setPickingColorFromDocument(false);
    if (onPickEnd) { onPickEnd() }
  }, [ customProps, once, setPickingColorFromDocument ]);

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
    if(document.body && (cursorActive && cursorInactive)) {
      document.body.style.cursor = pickingColorFromDocument ? cursorActive : cursorInactive
    }
  }, [pickingColorFromDocument, cursorActive, cursorInactive]);

  return [ colors, pickColor, cancelPickColor ];
};
