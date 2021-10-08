import * as React from 'react';
import { HookOptions, RgbObj } from './types';
import { parseRGB } from './color-utils/parseRgb';
import { rgbToHex } from './color-utils/rgbToHex';
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
}: HookOptions = {}): ReturnValue => {
  const [colors, setColors] = useState(initialStateColors);
  const [pickingColorFromDocument, setPickingColorFromDocument] = useState(false);

  const pickColor = () => {
    setPickingColorFromDocument(true);
  };

  const cancelPickColor = () => {
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

  const extractColor = useCallback(async (e: any) => {
    const { target } = e;

    const targetCanvas = await targetToCanvas(target)
    const rgbColor = getColor(pickRadius, targetCanvas, e)

    updateColors(rgbColor)
    once && setPickingColorFromDocument(false);
  }, [ once, setPickingColorFromDocument ]);

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
    if(document.body) {
      document.body.style.cursor = pickingColorFromDocument ? cursorActive : cursorInactive;
    }
  }, [pickingColorFromDocument, cursorActive, cursorInactive]);

  return [ colors, pickColor, cancelPickColor ];
};
