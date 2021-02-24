import * as React from 'react';
import { OnChangeEyedrop } from './types';
declare type Props = {
    onChange: (changes: OnChangeEyedrop) => void;
    wrapperClasses?: string;
    buttonClasses?: string;
    customComponent?: React.FC<any>;
    once?: boolean;
    cursorActive?: string;
    cursorInactive?: string;
    onInit?: Function;
    onPickStart?: Function;
    colorsPassThrough?: string;
    pickRadius?: number;
    disabled?: boolean;
    children?: React.ReactNode;
    customProps?: {
        [key: string]: any;
    };
};
export declare const EyeDropper: (props: Props) => any;
export {};
