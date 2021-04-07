"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EyeDropper = void 0;
const React = require("react");
const getCanvasPixelColor = require("get-canvas-pixel-color");
const _html2canvas = require("html2canvas");
const calcAverageColor_1 = require("./calcAverageColor");
const extractColors_1 = require("./extractColors");
const imageToCanvas_1 = require("./imageToCanvas");
const parseRgb_1 = require("./parseRgb");
const rgbToHex_1 = require("./rgbToHex");
const validatePickRadius_1 = require("./validatePickRadius");
const html2canvas = _html2canvas;
const { useCallback, useEffect, useState } = React;
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
};
const initialStateColors = { rgb: '', hex: '' };
const EyeDropper = (props) => {
    const [colors, setColors] = useState(initialStateColors);
    const [pickingColorFromDocument, setPickingColorFromDocument] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { once = true, pickRadius = 0, onInit, cursorActive = 'copy', cursorInactive = 'auto', onChange, wrapperClasses, buttonClasses, customComponent: CustomComponent, colorsPassThrough, children, customProps, disabled, onPickStart } = props;
    const setPickingMode = useCallback((isPicking, disableButton, showActiveCursor) => {
        if (document.body) {
            document.body.style.cursor = showActiveCursor ? cursorActive : cursorInactive;
        }
        setPickingColorFromDocument(isPicking);
        setButtonDisabled(disableButton);
    }, [cursorActive, cursorInactive]);
    const exitPick = useCallback((event) => event.keyCode === 27 && (setPickingMode(false, false, false)), [setPickingMode]);
    const pickColor = () => {
        if (onPickStart) {
            onPickStart();
        }
        setPickingMode(true, disabled || true, true);
    };
    const deactivateColorPicking = useCallback(() => setPickingMode(false, false, false), [setPickingMode]);
    const updateColors = useCallback((rgbObj) => {
        const rgb = parseRgb_1.parseRGB(rgbObj);
        const hex = rgbToHex_1.rgbToHex(rgbObj);
        // set color object to parent handler
        onChange({ rgb, hex, customProps });
        setColors({ rgb, hex });
    }, [customProps, onChange]);
    const targetToCanvas = useCallback((e) => {
        const { target } = e;
        if (target.nodeName.toLowerCase() === 'img') {
            // Convert image to canvas because `html2canvas` can not
            const { offsetX, offsetY } = e;
            imageToCanvas_1.imageToCanvas(target).then((value) => {
                const { r, g, b } = getCanvasPixelColor(value, offsetX, offsetY);
                updateColors({ r, g, b });
                once && deactivateColorPicking();
            });
            return;
        }
        const { offsetX, offsetY } = e;
        html2canvas(target, { logging: false }).then((canvasEl) => {
            if (pickRadius === undefined || pickRadius === 0) {
                const { r, g, b } = getCanvasPixelColor(canvasEl, offsetX, offsetY);
                updateColors({ r, g, b });
            }
            else {
                const colorBlock = extractColors_1.extractColors(canvasEl, pickRadius, offsetX, offsetY);
                const rgbColor = calcAverageColor_1.calcAverageColor(colorBlock);
                updateColors(rgbColor);
            }
        });
        once && deactivateColorPicking();
    }, [deactivateColorPicking, once, pickRadius, updateColors]);
    useEffect(() => {
        onInit && onInit();
    }, [onInit]);
    useEffect(() => {
        pickRadius && validatePickRadius_1.validatePickRadius(pickRadius);
    }, [pickRadius]);
    // setup listener for canvas picking click
    useEffect(() => {
        if (pickingColorFromDocument) {
            document.addEventListener('click', targetToCanvas);
        }
        return () => {
            if (once || pickingColorFromDocument) {
                document.removeEventListener('click', targetToCanvas);
            }
        };
    }, [pickingColorFromDocument, once, targetToCanvas]);
    // setup listener for the esc key
    useEffect(() => {
        document.addEventListener('keydown', exitPick);
        return () => {
            document.removeEventListener('keydown', exitPick);
        };
    }, [exitPick]);
    const shouldColorsPassThrough = colorsPassThrough ? { [colorsPassThrough]: colors } : {};
    return (React.createElement("div", { style: styles.eyedropperWrapper, className: wrapperClasses }, CustomComponent ? (React.createElement(CustomComponent, Object.assign({ onClick: pickColor }, shouldColorsPassThrough, { customProps: customProps, disabled: buttonDisabled }))) : (React.createElement(React.Fragment, null,
        React.createElement("style", { dangerouslySetInnerHTML: { __html: `
            .react-eyedrop-button {
              background-color: #000000;
              color: #ffffff;
              border: 1px solid #ffffff;
              border-radius: 20%;
              padding: 10px 25px;
            }
          ` } }),
        React.createElement("button", { id: 'react-eyedrop-button', className: `react-eyedrop-button ${buttonClasses || ''}`, onClick: pickColor, disabled: buttonDisabled }, children)))));
};
exports.EyeDropper = EyeDropper;
