'use client';

import React, { useContext, useMemo } from 'react';
import { styled } from 'styled-components';

import { StylesByBreakpoint, WithBreakpointStyles, WithEditing } from '@/types/elementStyles';
import { BreakpointsContext, WithBreakpoints } from '@/utils/breakpointsProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import { mergeStylesByBreakpoint } from '@/utils/styles/mergeStyles';

const DEFAULT_CONTAINER_STYLES: StylesByBreakpoint = {
    mobile: { padding: '0 16px' },
    tablet: { padding: '0 24px' },
    desktop: { padding: '0', maxWidth: '1200px' },
};

const StyledContainer = styled.div<WithEditing<WithBreakpoints<WithBreakpointStyles>>>`
    display: block;
    width: 100%;
    margin: auto;

    ${({ stylesByBreakpoint, breakpoints, isEditing }) =>
        generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, isEditing)}
`;

const Container = ({ children, stylesByBreakpoint }: WithBreakpointStyles) => {
    const breakpoints = useContext(BreakpointsContext);

    const styles = useMemo(
        () => mergeStylesByBreakpoint(DEFAULT_CONTAINER_STYLES, breakpoints, stylesByBreakpoint),
        [stylesByBreakpoint, breakpoints]
    );

    return (
        <StyledContainer stylesByBreakpoint={styles} breakpoints={breakpoints}>
            {children}
        </StyledContainer>
    );
};

export default Container;
