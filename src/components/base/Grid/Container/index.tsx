import React, { PropsWithChildren, useContext, useMemo } from 'react';
import { styled } from 'styled-components';

import { StylesByBreakpoint, WithBreakpointStyles, WithGeneratedCSS } from '@/types/HTMLElements';
import { BreakpointsContext } from '@/utils/breakpointsProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import { mergeStylesByBreakpoint } from '@/utils/styles/mergeStyles';
import { EditorContext } from '@/utils/editorProvider';

const DEFAULT_CONTAINER_STYLES: StylesByBreakpoint = {
    mobile: { padding: '0 16px' },
    tablet: { padding: '0 24px' },
    desktop: { padding: '0', maxWidth: '1200px' },
};

const StyledContainer = styled.div<WithGeneratedCSS>`
    display: block;
    width: 100%;
    margin: auto;

    box-sizing: border-box;

    ${({ styleswithmedia }) => styleswithmedia}
`;

const Container = ({ children, stylesByBreakpoint }: WithBreakpointStyles<PropsWithChildren>) => {
    const breakpoints = useContext(BreakpointsContext);
    const { editing } = useContext(EditorContext);

    const styles = useMemo(
        () => mergeStylesByBreakpoint(DEFAULT_CONTAINER_STYLES, breakpoints, stylesByBreakpoint),
        [stylesByBreakpoint, breakpoints]
    );

    const styleswithmedia = useMemo(
        () => generateStylesByBreakpoint(styles, breakpoints, editing),
        [styles, breakpoints, editing]
    );

    return <StyledContainer styleswithmedia={styleswithmedia}>{children}</StyledContainer>;
};

export default Container;
