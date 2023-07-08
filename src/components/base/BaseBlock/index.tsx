import React, { useContext, useMemo } from 'react';
import { styled } from 'styled-components';

import { StyledBlock, WithGeneratedCSS } from '@/types/HTMLElements';
import { BreakpointsContext } from '@/utils/breakpointsProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import { EditorContext } from '@/utils/editorProvider';
import Renderer from '@/components/system/Renderer';

const StyledBaseElement = styled.div<WithGeneratedCSS>`
    ${({ styleswithmedia }) => styleswithmedia};
`;

const BaseBlock = ({
    stylesByBreakpoint,
    tag,
    editorId,
    props,
    childrenBlocks,
    children,
}: React.PropsWithChildren<StyledBlock>) => {
    const breakpoints = useContext(BreakpointsContext);
    const editing = useContext(EditorContext);

    const styleswithmedia = useMemo(
        () => generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, editing),
        [stylesByBreakpoint, breakpoints, editing]
    );

    const notEmptyProps = props ? props : {};

    const renderChildrenBlocks = () => {
        if (!childrenBlocks || !childrenBlocks.length) {
            return null;
        }

        return <Renderer blocks={childrenBlocks} />;
    };

    return (
        <StyledBaseElement
            as={tag}
            {...notEmptyProps}
            data-editor-id={editing ? editorId : null}
            styleswithmedia={styleswithmedia}
        >
            {children}
            {renderChildrenBlocks()}
        </StyledBaseElement>
    );
};

export default BaseBlock;
