import React, { RefObject, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';

import { StyledBlock, WithGeneratedCSS } from '@/types/HTMLElements';
import { BreakpointsContext } from '@/utils/breakpointsProvider';
import generateStylesByBreakpoint from '@/utils/styles/generateStylesByBreakpoint';
import { EditorContext } from '@/utils/editorProvider';
import Renderer from '@/components/system/Renderer/RendererEditor';
import DragNDrop from '@/components/system/DragNDrop';
import {
    DEFAULT_SCREEN_PARAMS,
    ScreenParams,
    ScreenParamsContext,
    ScreenParamsProvider,
} from '@/utils/screenParamsProvider';

const StyledBaseElement = styled.div<WithGeneratedCSS>`
    ${({ styleswithmedia }) => styleswithmedia};
`;

const BaseBlock = ({ stylesByBreakpoint, tag, path, content, children }: React.PropsWithChildren<StyledBlock>) => {
    const { breakpoint } = useContext(ScreenParamsContext);
    const breakpoints = useContext(BreakpointsContext);
    const { onDrop, selectedBlock } = useContext(EditorContext);

    const [mockScreenParams, setMockScreenParams] = useState<ScreenParams>(DEFAULT_SCREEN_PARAMS);

    const parentRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (parentRef.current) {
            const { width, height } = parentRef.current.getBoundingClientRect();

            setMockScreenParams({
                ...DEFAULT_SCREEN_PARAMS,
                breakpoint,
                width,
                height,
            });
        }
    }, [parentRef, breakpoint]);

    const styleswithmedia = useMemo(
        () => generateStylesByBreakpoint(stylesByBreakpoint, breakpoints, true),
        [stylesByBreakpoint, breakpoints]
    );

    const renderChildren = () => {
        if (!content) {
            return children;
        }

        return (
            <ScreenParamsProvider mockScreenParams={mockScreenParams}>
                <Renderer content={content} />
            </ScreenParamsProvider>
        );
    };

    if (selectedBlock?.path === path) {
        return (
            <DragNDrop stylesByBreakpoint={stylesByBreakpoint} data-path={path} tag={tag} onDrop={onDrop}>
                {renderChildren()}
            </DragNDrop>
        );
    }

    return (
        <StyledBaseElement
            ref={parentRef as RefObject<HTMLDivElement>}
            as={tag}
            data-path={path}
            styleswithmedia={styleswithmedia}
        >
            {renderChildren()}
        </StyledBaseElement>
    );
};

export default BaseBlock;
