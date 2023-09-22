import React, { useContext, useMemo } from 'react';
import { styled } from 'styled-components';

import { ElementType, GridContainer, StyledBlock, WithGeneratedCSS } from '@/types/HTMLElements';
import { BreakpointsContext } from '@/utils/breakpointsProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import Renderer from '@/components/system/Renderer/RendererClient';
import { Container } from '../Grid';

const StyledBaseElement = styled.div<WithGeneratedCSS>`
    box-sizing: border-box;

    ${({ $styleswithmedia }) => $styleswithmedia};
`;

const BaseBlock = ({
    $stylesByBreakpoint,
    tag,
    props,
    content,
    type,
}: React.PropsWithChildren<StyledBlock | GridContainer>) => {
    const breakpoints = useContext(BreakpointsContext);

    const styleswithmedia = useMemo(
        () => generateStylesByBreakpoint($stylesByBreakpoint, breakpoints, false),
        [$stylesByBreakpoint, breakpoints]
    );

    const notEmptyProps = props ? props : {};

    if (type === ElementType.CONTAINER) {
        return (
            <Container {...notEmptyProps} $stylesByBreakpoint={$stylesByBreakpoint}>
                <Renderer content={content} />
            </Container>
        );
    }

    return (
        <StyledBaseElement as={tag} {...notEmptyProps} $styleswithmedia={styleswithmedia}>
            <Renderer content={content} />
        </StyledBaseElement>
    );
};

export default BaseBlock;
