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
            return;
        }

        let breakpointStyleString = '';

        Object.keys(styles).forEach((key) => {
            const value = styles[key as keyof CSSProperties];

            if (!value) {
                return;
            }

            const withUnits = typeof value === 'number' ? `${value}px` : value;

            breakpointStyleString += `${camelToKebabCase(key)}: ${withUnits};`;
        });

        styleString += `${queryParent} (min-width: ${b.screen}px) {${breakpointStyleString}}`;
    });

    return styleString;
};

export default generateStylesByBreakpoint;
