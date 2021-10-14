import { MutableRefObject } from 'react';

export type RgbObj = {
  r: number
  g: number
  b: number
}

export type OnChangeEyedrop = {
  rgb: string
  hex: string
  customProps: any
}

export type HookOptions = {
  once?: boolean
  pickRadius?: number
  cursorActive?: string
  cursorInactive?: string
}

export type PickingMode = {
  isPicking: boolean,
  disableButton: boolean,
  showActiveCursor: boolean
}

export type TargetRef = {
  element: HTMLElement;
  rect: DOMRect;
};

export interface EyeDropperProps {
  areaSelector?: string;
  pixelateValue?: number;
  magnifierSize?: number;
  zoom?: number;
}

export interface MagnifierProps extends EyeDropperProps {
  active: boolean;
  canvas: HTMLCanvasElement | null;
  setColorCallback: any;
  target: MutableRefObject<TargetRef>;
}