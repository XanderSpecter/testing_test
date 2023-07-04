'use client';

import React, { useContext } from 'react';
import { styled } from 'styled-components';

import { WithBreakpointStyles, WithEditorSupport } from '@/types/elementStyles';
import { BreakpointsContext, WithBreakpoints } from '@/utils/breakpointsProvider';
import { EditorContext } from '@/utils/editorProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';

const StyledRow = styled.div<WithEditorSupport<WithBreakpoints<WithBreakpointStyles>>>`
    display: flex;
    margin-left: -4px;
    margin-right: -4px;

    box-sizing: border-box;

    flex-wrap: wrap;
    flex-direction: row;

    ${({ stylesByBreakpoint, breakpoints, editor }) =>
        generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, editor)}
`;

const Row = ({ children, stylesByBreakpoint }: WithBreakpointStyles) => {
    const breakpoints = useContext(BreakpointsContext);
    const editor = useContext(EditorContext);

    return (
        <StyledRow stylesByBreakpoint={stylesByBreakpoint} breakpoints={breakpoints} editor={editor}>
            {children}
        </StyledRow>
    );
};

export default Row;
