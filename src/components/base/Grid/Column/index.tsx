import React, { useContext, useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';

import { StylesByBreakpoint, WithBreakpointStyles, WithGeneratedCSS } from '@/types/HTMLElements';
import { BreakpointsContext } from '@/utils/breakpointsProvider';
import { EditorContext } from '@/utils/editorProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import { recalcColumnStyles } from './helpers';

const StyledColumn = styled.div<WithGeneratedCSS>`
    display: block;
    width: 100%;

    padding-left: 4px;
    padding-right: 4px;

    box-sizing: border-box;

    ${({ styleswithmedia }) => styleswithmedia}
`;

interface BaseColumnProps {
    cols?: Record<string, number>;
    maxCols?: Record<string, number>;
}

export type ColumnProps = WithBreakpointStyles<React.PropsWithChildren<BaseColumnProps>>;

const Column = (props: ColumnProps) => {
    const { children } = props;

    const breakpoints = useContext(BreakpointsContext);
    const { editing } = useContext(EditorContext);

    const [columnStyles, setColumnStyles] = useState<StylesByBreakpoint>({});

    useEffect(() => {
        const styles = recalcColumnStyles(props, breakpoints);

        setColumnStyles(styles);
    }, [props, breakpoints]);

    const styleswithmedia = useMemo(
        () => generateStylesByBreakpoint(columnStyles, breakpoints, editing),
        [columnStyles, breakpoints, editing]
    );

    return <StyledColumn styleswithmedia={styleswithmedia}>{children}</StyledColumn>;
};

export default Column;
