import { StylesByBreakpoint } from '@/types/HTMLElements';
import { Breakpoint } from '../breakpointsProvider';
import { CSSProperties } from 'react';
import { camelToKebabCase } from '../textHelpers';

const generateStylesByBreakpoint = (
    stylesByBreakpoint?: StylesByBreakpoint | null,
    breakpoints?: Breakpoint[],
    editor?: boolean
) => {
    if (!stylesByBreakpoint || !breakpoints || !breakpoints.length) {
        return '';
    }

    const queryParent = editor ? '@container editor' : '@media';

    let styleString = '';

    breakpoints.forEach((b) => {
        const styles = stylesByBreakpoint?.[b.name] || stylesByBreakpoint?.all;

        if (!styles) {
            return '';
        }

        const { hover, focus, ...rest } = styles;

        let breakpointStyleString = '';
        let breakpointHoverStyleString = '';
        let breakpointFocusStyleString = '';

        if (hover) {
            Object.keys(hover).forEach((key) => {
                const value = hover[key as keyof CSSProperties];

                if (!value) {
                    return;
                }

                const withUnits = typeof value === 'number' ? `${value}px` : value;

                breakpointHoverStyleString += `${camelToKebabCase(key)}: ${withUnits};`;
            });
        }

        if (focus) {
            Object.keys(focus).forEach((key) => {
                const value = focus[key as keyof CSSProperties];

                if (!value) {
                    return;
                }

                const withUnits = typeof value === 'number' ? `${value}px` : value;

                breakpointFocusStyleString += `${camelToKebabCase(key)}: ${withUnits};`;
            });
        }

        Object.keys(rest).forEach((key) => {
            const value = styles[key as keyof CSSProperties];

            if (!value) {
                return;
            }

            const withUnits = typeof value === 'number' ? `${value}px` : value;

            breakpointStyleString += `${camelToKebabCase(key)}: ${withUnits};`;
        });

        if (breakpointHoverStyleString) {
            breakpointStyleString += `&:hover{${breakpointHoverStyleString}}`;
        }

        if (breakpointFocusStyleString) {
            breakpointStyleString += `&:focus{${breakpointFocusStyleString}}`;
        }

        styleString += `${queryParent} (min-width: ${b.screen}px) {${breakpointStyleString}}`;
    });

    return styleString;
};

export default generateStylesByBreakpoint;
