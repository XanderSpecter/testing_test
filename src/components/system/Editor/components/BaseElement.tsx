'use client';

import React, { useContext } from 'react';
import { styled } from 'styled-components';

import { BaseElementParams, WithBreakpointStyles, WithEditorSupport } from '@/types/HTMLElements';
import { BreakpointsContext, WithBreakpoints } from '@/utils/breakpointsProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import { EditorContext } from '@/utils/editorProvider';

const StyledBaseElement = styled.div<WithEditorSupport<WithBreakpoints<WithBreakpointStyles<unknown>>>>`
    ${({ stylesByBreakpoint, breakpoints, editing }) =>
        generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, editing)}
`;

const BaseElement = ({ stylesByBreakpoint, tag, editorId }: BaseElementParams) => {
    const breakpoints = useContext(BreakpointsContext);
    const editing = useContext(EditorContext);

    return (
        <StyledBaseElement
            as={tag}
            data-editor-id={editorId}
            stylesByBreakpoint={stylesByBreakpoint}
            breakpoints={breakpoints}
            editing={editing}
        />
    );
};

export default BaseElement;
