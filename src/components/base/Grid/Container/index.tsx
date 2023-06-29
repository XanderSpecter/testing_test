'use client';

import React, { useContext } from 'react';
import { styled } from 'styled-components';

import { StylesByBreakpoint, WithBreakpointStyles } from '@/types/elementStyles';
import { BreakpointsContext, WithBreakpoints } from '@/utils/breakpointsProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';

const DEFAULT_CONTAINER_STYLES: StylesByBreakpoint = {
    mobile: { padding: '0 16px' },
    tablet: { padding: '0 24px' },
    desktop: { padding: '0', maxWidth: '1200px' },
};

const StyledContainer = styled.div<WithBreakpoints<WithBreakpointStyles>>`
    display: block;
    width: 100%;
    margin: auto;

    ${({ stylesByBreakpoint, breakpoints }) => generateStylesByBreakpoint(stylesByBreakpoint, breakpoints)}
`;

const Container = ({ children, stylesByBreakpoint }: WithBreakpointStyles) => {
    const breakpoints = useContext(BreakpointsContext);

    return (
        <StyledContainer stylesByBreakpoint={stylesByBreakpoint} breakpoints={breakpoints}>
            {children}
        </StyledContainer>
    );
};

Container.defaultProps = {
    stylesByBreakpoint: DEFAULT_CONTAINER_STYLES,
};

export default Container;
