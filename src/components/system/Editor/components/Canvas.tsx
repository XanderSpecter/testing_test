'use client';

import React, { RefObject } from 'react';
import { Typography } from 'antd';

import { ScreenParamsProvider } from '@/utils/screenParamsProvider';
import { EditorProvider } from '@/utils/editorProvider';
import { Resizer, CanvasContainer, InfoLabel, Scrollable, CanvasWrapper } from '../styled';
import useCanvasResize from '../hooks/useCanvasResize';
import { CANVAS_ID, CANVAS_RESIZER_ID } from '../constants';

const { Text } = Typography;

interface CanvasProps {
    onCanvasClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
    onBreakpointChange: (shortcut: string) => void;
}

export default function Canvas({
    children,
    onCanvasClick,
    onContextMenu,
    onBreakpointChange,
}: React.PropsWithChildren<CanvasProps>) {
    const { mockScreenParams, canvasParams, onResizerMouseDown, onMouseUp, canvasRef } = useCanvasResize({
        onBreakpointChange,
        onCanvasClick,
    });

    return (
        <CanvasWrapper onMouseUp={onMouseUp}>
            <InfoLabel>
                <Text color="#ffffff">
                    {mockScreenParams.breakpoint}: {mockScreenParams.width}px
                </Text>
            </InfoLabel>
            <CanvasContainer ref={canvasRef as RefObject<HTMLDivElement>} onClick={onCanvasClick} style={canvasParams}>
                <Resizer id={CANVAS_RESIZER_ID} onMouseDown={onResizerMouseDown} />
                <ScreenParamsProvider mockScreenParams={mockScreenParams}>
                    <EditorProvider editing={true}>
                        <Scrollable id={CANVAS_ID} onContextMenu={onContextMenu}>
                            {children}
                        </Scrollable>
                    </EditorProvider>
                </ScreenParamsProvider>
            </CanvasContainer>
        </CanvasWrapper>
    );
}
