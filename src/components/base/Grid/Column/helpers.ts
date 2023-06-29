import { Breakpoint } from '@/utils/breakpointsProvider';
import { ColumnProps } from '.';
import { StylesByBreakpoint } from '@/types/elementStyles';
import { CSSProperties } from 'react';
import { mergeStyles } from '@/utils/styles/mergeStyles';
import { DEFAULT_BREAKPOINTS } from '@/utils/breakpointsProvider/context';

const getMaxColsWithLimits = (maxCols: number, breakpoint: string) => {
    if (typeof maxCols !== 'number' || Number.isNaN(maxCols)) {
        return DEFAULT_BREAKPOINTS.find((b) => b.name === breakpoint)?.maxCols || 12;
    }

    if (maxCols < 1) {
        return 1;
    }

    return maxCols;
};

const getColumnMaxWidth = (cols: number, maxCols: number) => {
    if (cols >= maxCols) {
        return '100%';
    }

    const colsDivider = cols > 0 ? cols : 1;

    return `calc(100% / ${maxCols / colsDivider})`;
};

export const recalcColumnStyles = (
    { stylesByBreakpoint, cols, maxCols: customMaxCols }: ColumnProps,
    breakpoints: Breakpoint[]
): StylesByBreakpoint => {
    const styles: StylesByBreakpoint = {};

    if (!breakpoints || !breakpoints.length) {
        return styles;
    }

    breakpoints.forEach((b) => {
        const { name, maxCols } = b;

        if (!name) {
            return;
        }

        const correctedMaxCols = getMaxColsWithLimits(customMaxCols?.[name] || maxCols, name);
        const customStyles = stylesByBreakpoint?.[name];
        const currentCols = cols?.[name] || correctedMaxCols;

        const baseStyles: CSSProperties = { maxWidth: getColumnMaxWidth(currentCols, correctedMaxCols) };

        const breakpointStyles = mergeStyles(baseStyles, customStyles);
        styles[name] = breakpointStyles;
    });

    return styles;
};
