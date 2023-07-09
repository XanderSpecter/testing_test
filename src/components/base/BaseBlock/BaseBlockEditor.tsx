import React, { useContext, useMemo } from 'react';
import { styled } from 'styled-components';

import { StyledBlock, WithGeneratedCSS } from '@/types/HTMLElements';
import { BreakpointsContext } from '@/utils/breakpointsProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import { EditorContext } from '@/utils/editorProvider';
import Renderer from '@/components/system/Renderer/RendererEditor';

const StyledBaseElement = styled.div<WithGeneratedCSS>`
    ${({ styleswithmedia }) => styleswithmedia};
`;

const BaseBlock = ({
    stylesByBreakpoint,
    tag,
    path,
    props,
    content,
    children,
}: React.PropsWithChildren<StyledBlock>) => {
    const breakpoints = useContext(BreakpointsContext);
    const { editing } = useContext(EditorContext);

    const styleswithmedia = useMemo(
        () => generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, editing),
        [stylesByBreakpoint, breakpoints, editing]
    );

    const notEmptyProps = props ? props : {};

    const renderChildren = () => {
        if (!content) {
            return children;
        }

        return <Renderer content={content} />;
    };

    return (
        <StyledBaseElement
            as={tag}
            {...notEmptyProps}
            data-path={editing ? path : null}
            styleswithmedia={styleswithmedia}
        >
            {renderChildren()}
        </StyledBaseElement>
    );
};

export default BaseBlock;
