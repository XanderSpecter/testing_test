import { StylesByBreakpoint } from '@/types/HTMLElements';
import { Breakpoint } from '../breakpointsProvider';
import { css } from 'styled-components';
import { CSSProperties } from 'react';
import { camelToKebabCase } from '../textHelpers';

const generateStylesByBreakpoint = (
    stylesByBreakpoint?: StylesByBreakpoint | null,
    breakpoints?: Breakpoint[],
    editor?: boolean
) => {
    if (!stylesByBreakpoint || !breakpoints || !breakpoints.length) {
        return css``;
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

            breakpointStyleString += `${camelToKebabCase(key)}: ${value};\n`;
        });

        styleString += `${queryParent} (min-width: ${b.screen}px) {
            ${breakpointStyleString}
        }`;
    });

    return css`
        ${styleString}
    `;
};

export default generateStylesByBreakpoint;
