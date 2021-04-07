import { HookOptions } from './types';
declare const initialStateColors: {
    rgb: string;
    hex: string;
};
export declare const useEyeDrop: ({ once, pickRadius, cursorActive, cursorInactive, }?: HookOptions) => [typeof initialStateColors, () => void, () => void];
export {};
