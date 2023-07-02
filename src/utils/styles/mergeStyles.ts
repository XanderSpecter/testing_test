import { CSSProperties } from 'react';
import { Property } from 'csstype';
import { StylesByBreakpoint } from '@/types/elementStyles';
import { Breakpoint } from '../breakpointsProvider';

const calcDisplay = (defaultStyles: CSSProperties, customStyles: CSSProperties): Property.Display => {
    const baseDisplay = defaultStyles.display || customStyles.display;

    const needJustifyContent = defaultStyles.justifyContent || customStyles.justifyContent;
    const needAlignItems = defaultStyles.alignItems || customStyles.alignItems;

    if (needJustifyContent || needAlignItems) {
        return 'flex';
    }

    return baseDisplay || 'block';
};

export const mergeStyles = (defaultStyles: CSSProperties, customStyles?: CSSProperties) => {
    if (!customStyles) {
        return { ...defaultStyles, display: calcDisplay(defaultStyles, {}) };
    }

    const merged: CSSProperties = { ...defaultStyles, ...customStyles };

    merged.display = calcDisplay(defaultStyles, customStyles);

    return merged;
};

export const mergeStylesByBreakpoint = (
    defaultStyles: StylesByBreakpoint,
    breakpoints: Breakpoint[],
    customStyles?: StylesByBreakpoint
) => {
    if (!customStyles || !breakpoints || !breakpoints.length) {
        return defaultStyles;
    }

    const merged: StylesByBreakpoint = {};

    breakpoints.map((b) => {
        const { name } = b;

        merged[name] = mergeStyles(
            defaultStyles[name] || defaultStyles.all || {},
            customStyles[name] || customStyles.all || {}
        );
    });

    return merged;
};
