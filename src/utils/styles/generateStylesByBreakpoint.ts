import { CSSPropertyKey, StyleByBreakpoint, StylesByBreakpoint } from '@/types/HTMLElements';
import { Breakpoint } from '../breakpointsProvider';
import { CSSProperties } from 'react';
import { camelToKebabCase } from '../textHelpers';

const getStyleString = (styles?: CSSProperties, baseStyles?: CSSProperties, previosBpStyles?: CSSProperties) => {
    let styleString = '';

    if (!styles) {
        return styleString;
    }

    Object.keys(styles).forEach((key) => {
        const value = styles[key as CSSPropertyKey];
        const baseValue = baseStyles?.[key as CSSPropertyKey];
        const previosValue = previosBpStyles?.[key as CSSPropertyKey];

        if (!value || value === baseValue || value === previosValue) {
            return;
        }

        const withUnits = typeof value === 'number' ? `${value}px` : value;

        styleString += `${camelToKebabCase(key)}: ${withUnits};`;
    });

    return styleString;
};

const getFullStylesString = (
    styles?: StyleByBreakpoint,
    baseStyles?: StyleByBreakpoint,
    previosBpStyles?: StyleByBreakpoint
) => {
    if (!styles) {
        return '';
    }

    const { hover, focus, ...rest } = styles;

    const baseStylesString = getStyleString(rest, baseStyles, previosBpStyles);
    const hoverStylesString = getStyleString(hover, baseStyles?.hover, previosBpStyles?.hover);
    const focusStylesString = getStyleString(focus, baseStyles?.focus, previosBpStyles?.focus);

    let fullStylesString = baseStylesString;

    if (hoverStylesString) {
        fullStylesString += `&:hover{${hoverStylesString}}`;
    }
    if (focusStylesString) {
        fullStylesString += `&:hover{${focusStylesString}}`;
    }

    return fullStylesString;
};

const generateStylesByBreakpoint = (
    $stylesByBreakpoint?: StylesByBreakpoint | null,
    breakpoints?: Breakpoint[],
    editor?: boolean
) => {
    if (!$stylesByBreakpoint || !breakpoints || !breakpoints.length) {
        return '';
    }

    const queryParent = editor ? '@container editor' : '@media';
    const baseStyles = $stylesByBreakpoint?.all;

    let styleString = getFullStylesString(baseStyles);

    breakpoints.forEach((b, i) => {
        const styles = $stylesByBreakpoint?.[b.name];
        const previosBpStyles = $stylesByBreakpoint?.[breakpoints[i - 1]?.name];

        if (!styles) {
            return '';
        }

        const breakpointStyleString = getFullStylesString(styles, baseStyles, previosBpStyles);

        if (breakpointStyleString) {
            styleString += `${queryParent} (min-width: ${b.screen}px) {${breakpointStyleString}}`;
        }
    });

    return styleString;
};

export default generateStylesByBreakpoint;
