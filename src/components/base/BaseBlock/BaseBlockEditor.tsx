import React, { RefObject, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';

import { ElementType, GridContainer, StyledBlock, WithGeneratedCSS } from '@/types/HTMLElements';
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
import { parseNumber } from '@/utils/textHelpers';
import { Container } from '../Grid';

const StyledBaseElement = styled.div<WithGeneratedCSS>`
    box-sizing: border-box;

    &:hover {
        box-shadow: 0px 0px 1px 1px #1677ff;
    }

    ${({ $styleswithmedia }) => $styleswithmedia};
`;

const BaseBlock = ({
    $stylesByBreakpoint,
    tag,
    path,
    type,
    content,
    children,
}: React.PropsWithChildren<StyledBlock | GridContainer>) => {
    const { breakpoint } = useContext(ScreenParamsContext);
    const breakpoints = useContext(BreakpointsContext);
    const { onDrop, selectedBlock } = useContext(EditorContext);

    const [mockScreenParams, setMockScreenParams] = useState<ScreenParams>(DEFAULT_SCREEN_PARAMS);

    const parentRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (parentRef.current) {
            const { width, height } = parentRef.current.getBoundingClientRect();

            const currentStyles = $stylesByBreakpoint?.[breakpoint] || $stylesByBreakpoint?.all;
            const {
                height: computedCSSHeight,
                paddingLeft,
                paddingRight,
                paddingTop,
                paddingBottom,
                borderLeftWidth,
                borderRightWidth,
                borderTopWidth,
                borderBottomWidth,
            } = getComputedStyle(parentRef.current);

            const isAutoHeight = computedCSSHeight === `${height}px` && !currentStyles?.height;

            const calculatedHorizontalPadding =
                parseNumber(paddingLeft) +
                parseNumber(paddingRight) +
                parseNumber(borderLeftWidth) +
                parseNumber(borderRightWidth);
            const calculatedVerticalPadding =
                parseNumber(paddingTop) +
                parseNumber(paddingBottom) +
                parseNumber(borderTopWidth) +
                parseNumber(borderBottomWidth);

            setMockScreenParams({
                ...DEFAULT_SCREEN_PARAMS,
                breakpoint,
                width: width - calculatedHorizontalPadding,
                height: isAutoHeight ? 'auto' : height - calculatedVerticalPadding,
            });
        }
    }, [parentRef, breakpoint, $stylesByBreakpoint]);

    const styleswithmedia = useMemo(
        () => generateStylesByBreakpoint($stylesByBreakpoint, breakpoints, true),
        [$stylesByBreakpoint, breakpoints]
    );

    const renderChildren = () => {
        if (!content || !Object.keys(content).length) {
            return children;
        }

        return (
            <ScreenParamsProvider mockScreenParams={mockScreenParams}>
                <Renderer content={content} />
            </ScreenParamsProvider>
        );
    };

    if (type === ElementType.HTMLELEMENT && selectedBlock?.path === path) {
        return (
            <DragNDrop $stylesByBreakpoint={$stylesByBreakpoint} data-path={path} tag={tag} onDrop={onDrop}>
                {renderChildren()}
            </DragNDrop>
        );
    }

    if (type === ElementType.CONTAINER) {
        return (
            <Container data-path={path} data-grid="true" $stylesByBreakpoint={$stylesByBreakpoint}>
                {renderChildren()}
            </Container>
        );
    }

    return (
        <StyledBaseElement
            ref={parentRef as RefObject<HTMLDivElement>}
            as={tag}
            data-path={path}
            $styleswithmedia={styleswithmedia}
        >
            {renderChildren()}
        </StyledBaseElement>
    );
};

export default BaseBlock;
