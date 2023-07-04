'use client';

import React, { useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';

import { StylesByBreakpoint, WithBreakpointStyles, WithEditorSupport } from '@/types/elementStyles';
import { BreakpointsContext, WithBreakpoints } from '@/utils/breakpointsProvider';
import { EditorContext } from '@/utils/editorProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import { recalcColumnStyles } from './helpers';

const StyledColumn = styled.div<WithEditorSupport<WithBreakpoints<WithBreakpointStyles>>>`
    display: block;
    width: 100%;

    padding-left: 4px;
    padding-right: 4px;

    box-sizing: border-box;

    ${({ stylesByBreakpoint, breakpoints, editor }) =>
        generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, editor)}
`;

interface BaseColumnProps {
    cols?: Record<string, number>;
    maxCols?: Record<string, number>;
}

export type ColumnProps = WithBreakpointStyles<React.PropsWithChildren<BaseColumnProps>>;

const Column = (props: ColumnProps) => {
    const { children } = props;

    const breakpoints = useContext(BreakpointsContext);
    const editor = useContext(EditorContext);

    const [columnStyles, setColumnStyles] = useState<StylesByBreakpoint>({});

    useEffect(() => {
        const styles = recalcColumnStyles(props, breakpoints);

        setColumnStyles(styles);
    }, [props, breakpoints]);

    return (
        <StyledColumn stylesByBreakpoint={{ ...columnStyles }} breakpoints={breakpoints} editor={editor}>
            {children}
        </StyledColumn>
    );
};

export default Column;
