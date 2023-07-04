'use client';

import React, { useContext, useMemo } from 'react';
import { styled } from 'styled-components';

import { StylesByBreakpoint, WithBreakpointStyles, WithEditorSupport } from '@/types/elementStyles';
import { BreakpointsContext, WithBreakpoints } from '@/utils/breakpointsProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import { mergeStylesByBreakpoint } from '@/utils/styles/mergeStyles';
import { EditorContext } from '@/utils/editorProvider';

const DEFAULT_CONTAINER_STYLES: StylesByBreakpoint = {
    mobile: { padding: '0 16px' },
    tablet: { padding: '0 24px' },
    desktop: { padding: '0', maxWidth: '1200px' },
};

const StyledContainer = styled.div<WithEditorSupport<WithBreakpoints<WithBreakpointStyles>>>`
    display: block;
    width: 100%;
    margin: auto;

    box-sizing: border-box;

    ${({ stylesByBreakpoint, breakpoints, editing }) =>
        generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, editing)}
`;

const Container = ({ children, stylesByBreakpoint }: WithBreakpointStyles) => {
    const breakpoints = useContext(BreakpointsContext);
    const editing = useContext(EditorContext);

    const styles = useMemo(
        () => mergeStylesByBreakpoint(DEFAULT_CONTAINER_STYLES, breakpoints, stylesByBreakpoint),
        [stylesByBreakpoint, breakpoints]
    );

    return (
        <StyledContainer stylesByBreakpoint={styles} breakpoints={breakpoints} editing={editing}>
            {children}
        </StyledContainer>
    );
};

export default Container;
