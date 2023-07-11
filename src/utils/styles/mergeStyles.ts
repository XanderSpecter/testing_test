import { CSSProperties } from 'react';
import { Property } from 'csstype';
import { StyleByBreakpoint, StylesByBreakpoint } from '@/types/HTMLElements';
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

export const mergeStyles = (defaultStyles: StyleByBreakpoint, customStyles?: StyleByBreakpoint | null) => {
    if (!customStyles) {
        return { ...defaultStyles, display: calcDisplay(defaultStyles, {}) };
    }

    const { hover: defaultHover, focus: defaultFocus, ...defaultRest } = defaultStyles;
    const { hover: customHover, focus: customFocus, ...customRest } = customStyles;

    const merged: StyleByBreakpoint = { ...defaultRest, ...customRest };

    if (defaultHover) {
        merged.hover = mergeStyles(defaultHover, customHover);
    }

    if (defaultFocus) {
        merged.focus = mergeStyles(defaultFocus, customFocus);
    }

    merged.display = calcDisplay(defaultStyles, customStyles);

    return merged;
};

export const mergeStylesByBreakpoint = (
    defaultStyles: StylesByBreakpoint,
    breakpoints: Breakpoint[],
    customStyles?: StylesByBreakpoint | null
) => {
    if (!customStyles || !breakpoints || !breakpoints.length) {
        return defaultStyles;
    }

    const merged: StylesByBreakpoint = {};

    merged.all = mergeStyles(defaultStyles.all || {}, customStyles.all);

    breakpoints.map((b) => {
        const { name } = b;

        merged[name] = mergeStyles(defaultStyles[name] || {}, customStyles[name] || {});
    });

    return merged;
};
