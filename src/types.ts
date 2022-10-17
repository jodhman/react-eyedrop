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
  onPickStart?: () => void
  onPickEnd?: () => void
  onPickCancel?: () => void
}

export type PickingMode = {
  isPicking: boolean,
  disableButton: boolean,
  showActiveCursor: boolean
}