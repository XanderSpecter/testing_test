import { StylesByBreakpoint } from '@/types/elementStyles';
import { Breakpoint } from '../breakpointsProvider';
import { css } from 'styled-components';
import { CSSProperties } from 'react';
import { camelToKebabCase } from '../textHelpers';

const generateStylesByBreakpoint = (stylesByBreakpoint?: StylesByBreakpoint, breakpoints?: Breakpoint[]) => {
    if (!stylesByBreakpoint || !breakpoints || !breakpoints.length) {
        return css``;
    }

    let styleString = '';

    breakpoints.forEach((b) => {
        const styles = stylesByBreakpoint[b.name];

        if (!styles) {
            return;
        }

        let breakpointStyleString = '';

        Object.keys(styles).forEach((key) => {
            const value = styles[key as keyof CSSProperties];

            if (!value) {
                return;
            }

            breakpointStyleString += `${camelToKebabCase(key)}: ${value};\n`;
        });

        styleString += `@media (min-width: ${b.screen}px) {
            ${breakpointStyleString}
        }`;
    });

    return css`
        ${styleString}
    `;
};

export default generateStylesByBreakpoint;
