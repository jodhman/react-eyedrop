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
