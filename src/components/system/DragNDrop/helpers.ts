import { CSSPropertyKey, StylesByBreakpoint } from '@/types/HTMLElements';
import { CSSProperties } from 'react';
import { DnDResizerPosition } from './styled/DnDResizer';
import {
    ABSOLUTE_POSITION_STYLES,
    ACCURACY_TOLERANCE,
    DEFAULT_ELEMENT_STYLES,
    DEFAULT_POSITION_STYLES,
    STATIC_POSITION_STYLES,
} from './constants';
import { ChangableStyles, PositionStyles } from './types';
import { mergeStyles } from '@/utils/styles/mergeStyles';
import { Breakpoint } from '@/utils/breakpointsProvider';
import getClosestBreakpointStyles from '@/utils/styles/getClosestBreakpointStyles';

interface RecalcWidthAndMarginsParams {
    width: string | number;
    offsetLeft: string | number;
    offsetRight?: string | number;
    offsetTop?: string | number;
    screenWidth: number;
}

export const recalcWidthAndOffsets = ({
    width,
    offsetTop,
    offsetLeft,
    offsetRight,
    screenWidth,
}: RecalcWidthAndMarginsParams) => {
    let calculatedWidth = 0;

    if (typeof width === 'number') {
        calculatedWidth = width;
    }

    if (typeof width === 'string' && width.includes('%')) {
        const widthPercent = parseInt(width);

        calculatedWidth = Math.round(screenWidth / widthPercent);
    }

    const calculatedOffsetTop = typeof offsetTop === 'number' ? offsetTop : 0;

    const calculatedOffsetLeft =
        typeof offsetLeft === 'number' ? offsetLeft : Math.round((screenWidth - calculatedWidth) / 2);

    const calculatedOffsetRight =
        typeof offsetRight === 'number' ? offsetRight : screenWidth - (calculatedOffsetLeft + calculatedWidth);

    return {
        calculatedWidth,
        calculatedOffsetTop,
        calculatedOffsetLeft,
        calculatedOffsetRight,
    };
};

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

        if (isStatic && k === 'marginRight' && styles[k as CSSPropertyKey] === 'auto') {
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

interface GetStartStylesParams {
    currentStyles?: CSSProperties | null;
    width: number;
    height: number;
    screenWidth: number;
    isStatic: boolean;
}

export const getStartStyles = ({
    currentStyles,
    width,
    height,
    screenWidth,
    isStatic,
}: GetStartStylesParams): ChangableStyles | null => {
    if (!currentStyles) {
        return null;
    }

    const { top, left, right, marginTop, marginLeft, marginRight } = currentStyles;

    const { calculatedOffsetTop, calculatedOffsetLeft, calculatedOffsetRight } = recalcWidthAndOffsets({
        screenWidth,
        width,
        offsetTop: isStatic ? marginTop || DEFAULT_POSITION_STYLES.marginTop : top || DEFAULT_POSITION_STYLES.top,
        offsetLeft: isStatic ? marginLeft || DEFAULT_POSITION_STYLES.marginLeft : left || DEFAULT_POSITION_STYLES.left,
        offsetRight: isStatic
            ? marginRight || DEFAULT_POSITION_STYLES.marginRight
            : right || DEFAULT_POSITION_STYLES.right,
    });

    return {
        top: isStatic ? 0 : calculatedOffsetTop,
        left: isStatic ? 0 : calculatedOffsetLeft,
        right: isStatic ? 0 : calculatedOffsetRight,
        marginTop: isStatic ? calculatedOffsetTop : 0,
        marginLeft: isStatic ? calculatedOffsetLeft : 0,
        marginRight: isStatic ? calculatedOffsetRight : 0,
        width,
        height,
    };
};

interface CalcParams {
    offsets: Coordinates;
    startStyles: ChangableStyles;
    screenWidth: number;
    isMarginAutoDisabled?: boolean;
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

    const { calculatedWidth, calculatedOffsetLeft, calculatedOffsetRight } = recalcWidthAndOffsets({
        width,
        offsetLeft: marginLeft || 0,
        screenWidth,
    });

    switch (resizerPosition) {
        case DnDResizerPosition.BOTTOM:
            return {
                marginTop,
                marginLeft: calculatedOffsetLeft,
                marginRight: calculatedOffsetRight,
                top,
                left,
                right,
                width: calculatedWidth,
                height: height + y,
                isHeightChanged: true,
            };
        case DnDResizerPosition.TOP:
            return {
                marginTop: marginTop + y,
                marginLeft: calculatedOffsetLeft,
                marginRight: calculatedOffsetRight,
                left,
                right,
                top: top + y,
                width: calculatedWidth,
                height: height - y,
                isHeightChanged: true,
            };
        case DnDResizerPosition.RIGHT:
            return {
                marginTop,
                marginLeft: calculatedOffsetLeft,
                marginRight: calculatedOffsetRight - x,
                right: right - x,
                top,
                left,
                width: calculatedWidth + x >= fullScreenWidth ? '100%' : calculatedWidth + x,
                height,
            };
        default:
            return {
                marginTop,
                marginLeft: calculatedOffsetLeft + x,
                marginRight: calculatedOffsetRight,
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
    const { width, height, top, left, right, marginLeft, marginRight, marginTop, isHeightChanged } = calculatedSizes;

    const { calculatedOffsetLeft } = recalcWidthAndOffsets({
        width,
        offsetLeft: marginLeft || 0,
        offsetRight: marginRight,
        screenWidth,
    });

    if (isStatic) {
        const calcMarginTop = marginTop < 0 ? 0 : marginTop;
        const calcMarginLeft = calculatedOffsetLeft < 0 ? 0 : calculatedOffsetLeft;

        return {
            top: 0,
            left: 0,
            right: 0,
            marginTop: calcMarginTop,
            marginLeft: calcMarginLeft,
            width: parseInt(String(width)) < 0 ? 0 : width,
            height: height < 0 ? 0 : height,
            isHeightChanged,
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
    { offsets, startStyles, screenWidth, isMarginAutoDisabled }: CalcParams,
    isStatic: boolean
): PositionStyles | null => {
    if (!offsets || !startStyles) {
        return null;
    }

    const { x, y } = offsets;

    const { top, left, marginTop, marginLeft, width } = startStyles;

    const { calculatedWidth, calculatedOffsetLeft: calcMarginLeft } = recalcWidthAndOffsets({
        width,
        offsetLeft: marginLeft || 0,
        screenWidth,
    });

    if (isStatic) {
        const offsetTop = marginTop + y > 0 ? marginTop + y : 0;
        const offsetLeft = calcMarginLeft + x;
        const offsetRight = screenWidth - (offsetLeft + calculatedWidth);

        const isMarginNotAuto =
            (offsetLeft < ACCURACY_TOLERANCE && offsetRight < ACCURACY_TOLERANCE) ||
            offsetLeft < offsetRight - ACCURACY_TOLERANCE ||
            offsetRight < offsetLeft - ACCURACY_TOLERANCE;

        const result: PositionStyles = {
            top: 0,
            left: 0,
            right: 0,
            marginTop: offsetTop,
        };

        if (isMarginNotAuto || isMarginAutoDisabled) {
            result.marginLeft = offsetLeft;
        } else {
            result.marginLeft = 'auto';
            result.marginRight = 'auto';
        }

        return result;
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

interface GetCurrentStylesParams {
    $stylesByBreakpoint?: StylesByBreakpoint | null;
    breakpoints: Breakpoint[];
    shortcut: string;
}

export const getCurrentStyles = ({ $stylesByBreakpoint, breakpoints, shortcut }: GetCurrentStylesParams) => {
    if (!$stylesByBreakpoint) {
        return DEFAULT_ELEMENT_STYLES;
    }

    const currentBreakpointStyles = getClosestBreakpointStyles({
        $stylesByBreakpoint,
        breakpoints,
        shortcut,
    });

    const baseStyles = mergeStyles(DEFAULT_ELEMENT_STYLES, $stylesByBreakpoint.all);

    return mergeStyles(baseStyles, currentBreakpointStyles);
};
