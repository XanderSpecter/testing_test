'use client';

import React, { PropsWithChildren, useContext } from 'react';
import { styled } from 'styled-components';

import { WithBreakpointStyles, WithEditorSupport } from '@/types/HTMLElements';
import { BreakpointsContext, WithBreakpoints } from '@/utils/breakpointsProvider';
import { EditorContext } from '@/utils/editorProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';

const StyledRow = styled.div<WithEditorSupport<WithBreakpoints<WithBreakpointStyles<PropsWithChildren>>>>`
    display: flex;
    margin-left: -4px;
    margin-right: -4px;

    box-sizing: border-box;

    flex-wrap: wrap;
    flex-direction: row;

    ${({ stylesByBreakpoint, breakpoints, editing }) =>
        generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, editing)}
`;

const Row = ({ children, stylesByBreakpoint }: WithBreakpointStyles<PropsWithChildren>) => {
    const breakpoints = useContext(BreakpointsContext);
    const editing = useContext(EditorContext);

    return (
        <StyledRow stylesByBreakpoint={stylesByBreakpoint} breakpoints={breakpoints} editing={editing}>
            {children}
        </StyledRow>
    );
};

export default Row;
