'use client';

import React, { RefObject } from 'react';
import { Typography } from 'antd';

import { ScreenParamsProvider } from '@/utils/screenParamsProvider';
import { EditorProvider } from '@/utils/editorProvider';
import { Resizer, CanvasContainer, InfoLabel, Scrollable, CanvasWrapper, ScrollBarCompensator } from './styled';
import useCanvasResize from '../../hooks/useCanvasResize';

const { Text } = Typography;

export default function Canvas({ children }: React.PropsWithChildren) {
    const { mockScreenParams, canvasParams, onResizerMouseDown, onMouseUp, canvasRef } = useCanvasResize();

    return (
        <CanvasWrapper onMouseUp={onMouseUp}>
            <CanvasContainer ref={canvasRef as RefObject<HTMLDivElement>} style={canvasParams}>
                <Resizer onMouseDown={onResizerMouseDown} />
                <InfoLabel>
                    <Text color="#ffffff">
                        {mockScreenParams.breakpoint}: {mockScreenParams.width}px
                    </Text>
                </InfoLabel>
                <ScreenParamsProvider mockScreenParams={mockScreenParams}>
                    <EditorProvider editing={true}>
                        <ScrollBarCompensator>
                            <Scrollable>{children}</Scrollable>
                        </ScrollBarCompensator>
                    </EditorProvider>
                </ScreenParamsProvider>
            </CanvasContainer>
        </CanvasWrapper>
    );
}
