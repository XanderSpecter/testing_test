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
    box-sizing: border-box;

    &:hover {
        box-shadow: 0px 0px 1px 1px #1677ff;
    }

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

            const currentStyles = stylesByBreakpoint?.[breakpoint] || stylesByBreakpoint?.all;
            const { height: computedCSSHeight } = getComputedStyle(parentRef.current);

            const isAutoHeight = computedCSSHeight === `${height}px` && !currentStyles?.height;

            setMockScreenParams({
                ...DEFAULT_SCREEN_PARAMS,
                breakpoint,
                width,
                height: isAutoHeight ? 'auto' : height,
            });
        }
    }, [parentRef, breakpoint, stylesByBreakpoint]);

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
