import React, { useContext, useMemo } from 'react';
import { styled } from 'styled-components';

import { StyledBlock, WithGeneratedCSS } from '@/types/HTMLElements';
import { BreakpointsContext } from '@/utils/breakpointsProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import Renderer from '@/components/system/Renderer/RendererClient';

const StyledBaseElement = styled.div<WithGeneratedCSS>`
    ${({ styleswithmedia }) => styleswithmedia};
`;

const BaseBlock = ({ stylesByBreakpoint, tag, props, content }: React.PropsWithChildren<StyledBlock>) => {
    const breakpoints = useContext(BreakpointsContext);

    const styleswithmedia = useMemo(
        () => generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, false),
        [stylesByBreakpoint, breakpoints]
    );

    const notEmptyProps = props ? props : {};

    return (
        <StyledBaseElement as={tag} {...notEmptyProps} styleswithmedia={styleswithmedia}>
            <Renderer content={content} />
        </StyledBaseElement>
    );
};

export default BaseBlock;
