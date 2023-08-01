import { Breakpoint } from '@/utils/breakpointsProvider';
import { ColumnProps } from '.';
import { StylesByBreakpoint } from '@/types/HTMLElements';
import { CSSProperties } from 'react';
import { calcDisplay, mergeStyles } from '@/utils/styles/mergeStyles';
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

        const correctedMaxCols = getMaxColsWithLimits(customMaxCols?.[name] || customMaxCols?.all || maxCols, name);
        const customStyles = stylesByBreakpoint?.[name] || stylesByBreakpoint?.all;
        const currentCols = typeof cols === 'number' ? cols : cols?.[name] || cols?.all || correctedMaxCols;

        const baseStyles: CSSProperties = { maxWidth: getColumnMaxWidth(currentCols, correctedMaxCols) };

        const breakpointStyles = mergeStyles(baseStyles, customStyles);
        breakpointStyles.display = calcDisplay(baseStyles, customStyles || {});

        styles[name] = breakpointStyles;
    });

    return styles;
};
