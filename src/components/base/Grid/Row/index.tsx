import React, { PropsWithChildren, useContext, useMemo } from 'react';
import { styled } from 'styled-components';

import { WithBreakpointStyles, WithGeneratedCSS } from '@/types/HTMLElements';
import { BreakpointsContext } from '@/utils/breakpointsProvider';
import { EditorContext } from '@/utils/editorProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';

const StyledRow = styled.div<WithGeneratedCSS<Omit<Partial<HTMLDivElement>, 'children'>>>`
    display: flex;
    margin-left: -4px;
    margin-right: -4px;

    box-sizing: border-box;

    flex-wrap: wrap;
    flex-direction: row;

    ${({ $styleswithmedia }) => $styleswithmedia}
`;

const Row = ({
    children,
    $stylesByBreakpoint,
    ...rest
}: WithBreakpointStyles<PropsWithChildren<Omit<Partial<HTMLDivElement>, 'children'>>>) => {
    const breakpoints = useContext(BreakpointsContext);
    const { editing } = useContext(EditorContext);

    const styleswithmedia = useMemo(
        () => generateStylesByBreakpoint($stylesByBreakpoint, breakpoints, editing),
        [$stylesByBreakpoint, breakpoints, editing]
    );

    return (
        <StyledRow {...rest} $styleswithmedia={styleswithmedia}>
            {children}
        </StyledRow>
    );
};

export default Row;
