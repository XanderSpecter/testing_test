import { CSSPropertyKey } from '@/types/HTMLElements';
import { CSSProperties } from 'react';
import { DnDResizerPosition } from './styled/DnDResizer';
import { ACCURACY_TOLERANCE } from './constants';

interface RecalcWidthAndMarginsParams {
    width: string | number;
    marginLeft: string | number;
    marginRight?: string | number;
    screenWidth: number;
}

export const recalcWidthAndMargins = ({ width, marginLeft, marginRight, screenWidth }: RecalcWidthAndMarginsParams) => {
    let calculatedWidth = 0;

    if (typeof width === 'number') {
        calculatedWidth = width;
    }

    if (typeof width === 'string' && width.includes('%')) {
        const widthPercent = parseInt(width);

        calculatedWidth = Math.round(screenWidth / widthPercent);
    }

    const calculatedMarginLeft =
        typeof marginLeft === 'number' ? marginLeft : Math.round((screenWidth - calculatedWidth) / 2);

    const calculatedMarginRight =
        typeof marginRight === 'number' ? marginRight : screenWidth - (calculatedMarginLeft + calculatedWidth);

    return {
        calculatedWidth,
        calculatedMarginLeft,
        calculatedMarginRight,
    };
};

const STATIC_POSITION_STYLES: CSSPropertyKey[] = [
    'width',
    'height',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
];

const ABSOLUTE_POSITION_STYLES: CSSPropertyKey[] = ['width', 'height', 'top', 'bottom', 'left', 'right'];

export const filterOnlyDnDStyles = (styles: CSSProperties, isStatic?: boolean) => {
    const filtered: Record<string, unknown> = {};

    if (!styles) {
        return filtered as CSSProperties;
    }

    const styleChecker = isStatic ? STATIC_POSITION_STYLES : ABSOLUTE_POSITION_STYLES;

    Object.keys(styles).forEach((k) => {
        if (styleChecker.includes(k as CSSPropertyKey)) {
            filtered[k] = styles[k as CSSPropertyKey];
        }
    });

    return filtered as CSSProperties;
};

export interface Coordinates {
    x: number;
    y: number;
}

export const calcCursorOffsets = (e: MouseEvent, cursorStartPosition: Coordinates): Coordinates | null => {
    if (!e || !cursorStartPosition) {
        return null;
    }

    const { x, y } = cursorStartPosition;
    const { pageX, pageY } = e;

    return {
        x: pageX - x,
        y: pageY - y,
    };
};

export interface ChangableStyles {
    top: number;
    left: number;
    right: number;
    marginTop: number;
    marginLeft: string | number;
    marginRight: string | number;
    width: string | number;
    height: number;
}

export type PositionStyles = Omit<ChangableStyles, 'width' | 'height'>;

interface CalcParams {
    offsets: Coordinates;
    startStyles: ChangableStyles;
    screenWidth: number;
}

interface CalcResizeParams extends CalcParams {
    resizerPosition: DnDResizerPosition;
}

export const calcResize = ({
    offsets,
    startStyles,
    resizerPosition,
    screenWidth,
}: CalcResizeParams): ChangableStyles | null => {
    if (!offsets || !startStyles || !resizerPosition) {
        return null;
    }

    const { width, height, top, left, right, marginLeft, marginTop } = startStyles;
    const { x, y } = offsets;

    const fullScreenWidth = screenWidth - ACCURACY_TOLERANCE;

    const { calculatedWidth, calculatedMarginLeft, calculatedMarginRight } = recalcWidthAndMargins({
        width,
        marginLeft,
        screenWidth,
    });

    switch (resizerPosition) {
        case DnDResizerPosition.BOTTOM:
            return {
                marginTop,
                marginLeft: calculatedMarginLeft,
                marginRight: calculatedMarginRight,
                top,
                left,
                right,
                width: calculatedWidth,
                height: height + y,
            };
        case DnDResizerPosition.TOP:
            return {
                marginTop: marginTop + y,
                marginLeft: calculatedMarginLeft,
                marginRight: calculatedMarginRight,
                left,
                right,
                top: top + y,
                width: calculatedWidth,
                height: height - y,
            };
        case DnDResizerPosition.RIGHT:
            return {
                marginTop,
                marginLeft: calculatedMarginLeft,
                marginRight: calculatedMarginRight - x,
                right: right - x,
                top,
                left,
                width: calculatedWidth + x >= fullScreenWidth ? '100%' : calculatedWidth + x,
                height,
            };
        default:
            return {
                marginTop,
                marginLeft: calculatedMarginLeft + x,
                marginRight: calculatedMarginRight,
                top,
                right,
                left: left + x,
                width: calculatedWidth - x >= fullScreenWidth ? '100%' : calculatedWidth - x,
                height,
            };
    }
};

export const getStylesAfterResize = (params: CalcResizeParams, isStatic: boolean): ChangableStyles | null => {
    const calculatedSizes = calcResize(params);

    if (!calculatedSizes) {
        return null;
    }

    const { screenWidth } = params;
    const { width, height, top, left, right, marginLeft, marginRight, marginTop } = calculatedSizes;

    const { calculatedMarginLeft, calculatedMarginRight } = recalcWidthAndMargins({
        width,
        marginLeft,
        marginRight,
        screenWidth,
    });

    if (isStatic) {
        const calcMarginTop = marginTop < 0 ? 0 : marginTop;
        const calcMarginLeft = calculatedMarginLeft < 0 ? 0 : calculatedMarginLeft;
        const calcMarginRight = calculatedMarginRight < 0 ? 0 : calculatedMarginRight;

        return {
            top: 0,
            left: 0,
            right: 0,
            marginTop: calcMarginTop,
            marginLeft: calcMarginLeft,
            marginRight: calcMarginRight,
            width: parseInt(String(width)) < 0 ? 0 : width,
            height: height < 0 ? 0 : height,
        };
    }

    return {
        top,
        left,
        right,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        width: parseInt(String(width)) < 0 ? 0 : width,
        height: height < 0 ? 0 : height,
    };
};

export const getStylesAfterMove = (
    { offsets, startStyles, screenWidth }: CalcParams,
    isStatic: boolean
): PositionStyles | null => {
    if (!offsets || !startStyles) {
        return null;
    }

    const { x, y } = offsets;

    const { top, left, marginTop, marginLeft, width } = startStyles;

    const { calculatedWidth, calculatedMarginLeft } = recalcWidthAndMargins({
        width,
        marginLeft,
        screenWidth,
    });

    if (isStatic) {
        const calcMarginTop = marginTop + y;
        const calcMarginLeft = calculatedMarginLeft + x;
        const calcMarginRight = screenWidth - (calcMarginLeft + calculatedWidth);

        const renderedMarginTop = calcMarginTop < 0 ? 0 : calcMarginTop;
        const renderedMarginLeft = calcMarginLeft < 0 ? 0 : calcMarginLeft;
        const renderedMarginRight = calcMarginRight < 0 ? 0 : calcMarginRight;

        const isMarginNotAuto =
            calcMarginLeft < calcMarginRight - ACCURACY_TOLERANCE ||
            calcMarginRight < calcMarginLeft - ACCURACY_TOLERANCE;

        return {
            top: 0,
            left: 0,
            right: 0,
            marginTop: renderedMarginTop,
            marginLeft: isMarginNotAuto ? renderedMarginLeft : 'auto',
            marginRight: isMarginNotAuto ? renderedMarginRight : 'auto',
        };
    }

    const calculatedTop = top + y;
    const calculatedLeft = left + x;
    const calculatedRight = screenWidth - (calculatedLeft + calculatedWidth);

    return {
        top: calculatedTop < 0 ? 0 : calculatedTop,
        left: calculatedLeft < 0 ? 0 : calculatedLeft,
        right: calculatedRight < 0 ? 0 : calculatedRight,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
    };
};
