'use client';

import React, { RefObject } from 'react';
import { Typography } from 'antd';

import { ScreenParamsProvider } from '@/utils/screenParamsProvider';
import { EditorProvider } from '@/utils/editorProvider';
import { Resizer, CanvasContainer, InfoLabel, Scrollable, CanvasWrapper, ScrollBarCompensator } from '../styled';
import useCanvasResize from '../hooks/useCanvasResize';

const { Text } = Typography;

interface CanvasProps {
    onCanvasClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    onBreakpointChange: (shortcut: string) => void;
}

export default function Canvas({ children, onCanvasClick, onBreakpointChange }: React.PropsWithChildren<CanvasProps>) {
    const { mockScreenParams, canvasParams, onResizerMouseDown, onMouseUp, canvasRef } = useCanvasResize({
        onBreakpointChange,
    });

    return (
        <CanvasWrapper onMouseUp={onMouseUp}>
            <InfoLabel>
                <Text color="#ffffff">
                    {mockScreenParams.breakpoint}: {mockScreenParams.width}px
                </Text>
            </InfoLabel>
            <CanvasContainer ref={canvasRef as RefObject<HTMLDivElement>} style={canvasParams}>
                <Resizer onMouseDown={onResizerMouseDown} />
                <ScreenParamsProvider mockScreenParams={mockScreenParams}>
                    <EditorProvider editing={true}>
                        <ScrollBarCompensator>
                            <Scrollable onClick={onCanvasClick}>{children}</Scrollable>
                        </ScrollBarCompensator>
                    </EditorProvider>
                </ScreenParamsProvider>
            </CanvasContainer>
        </CanvasWrapper>
    );
}
