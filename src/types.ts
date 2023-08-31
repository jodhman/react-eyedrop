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
  cursorAwait?: string,
  customProps?: { [key: string]: any }
  onPickStart?: () => void
  onPickEnd?: () => void
  onExtractColor?: () => void,
  onPickCancel?: () => void
  onChange?: (changes: OnChangeEyedrop) => void  
}

export type PickingMode = {
  isPicking: boolean,
  disableButton: boolean,
  showActiveCursor: boolean
}