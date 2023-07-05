'use client';

import React, { useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';

import { StylesByBreakpoint, WithBreakpointStyles, WithEditorSupport } from '@/types/HTMLElements';
import { BreakpointsContext, WithBreakpoints } from '@/utils/breakpointsProvider';
import { EditorContext } from '@/utils/editorProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import { recalcColumnStyles } from './helpers';

const StyledColumn = styled.div<WithEditorSupport<WithBreakpoints<WithBreakpointStyles<BaseColumnProps>>>>`
    display: block;
    width: 100%;

    padding-left: 4px;
    padding-right: 4px;

    box-sizing: border-box;

    ${({ stylesByBreakpoint, breakpoints, editing }) =>
        generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, editing)}
`;

interface BaseColumnProps {
    cols?: Record<string, number>;
    maxCols?: Record<string, number>;
}

export type ColumnProps = WithBreakpointStyles<React.PropsWithChildren<BaseColumnProps>>;

const Column = (props: ColumnProps) => {
    const { children } = props;

    const breakpoints = useContext(BreakpointsContext);
    const editing = useContext(EditorContext);

    const [columnStyles, setColumnStyles] = useState<StylesByBreakpoint>({});

    useEffect(() => {
        const styles = recalcColumnStyles(props, breakpoints);

        setColumnStyles(styles);
    }, [props, breakpoints]);

    return (
        <StyledColumn stylesByBreakpoint={{ ...columnStyles }} breakpoints={breakpoints} editing={editing}>
            {children}
        </StyledColumn>
    );
};

export default Column;
