'use client';

import React, { useContext } from 'react';
import { styled } from 'styled-components';

import { WithBreakpointStyles, WithEditing } from '@/types/elementStyles';
import { BreakpointsContext, WithBreakpoints } from '@/utils/breakpointsProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';

const StyledRow = styled.div<WithEditing<WithBreakpoints<WithBreakpointStyles>>>`
    display: flex;
    margin-left: -4px;
    margin-right: -4px;

    box-sizing: border-box;

    flex-wrap: wrap;
    flex-direction: row;

    ${({ stylesByBreakpoint, breakpoints, isEditing }) =>
        generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, isEditing)}
`;

const Row = ({ children, stylesByBreakpoint }: WithBreakpointStyles) => {
    const breakpoints = useContext(BreakpointsContext);

    return (
        <StyledRow stylesByBreakpoint={stylesByBreakpoint} breakpoints={breakpoints}>
            {children}
        </StyledRow>
    );
};

export default Row;
