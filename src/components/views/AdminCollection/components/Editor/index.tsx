'use client';

import React, { RefObject, useState } from 'react';
import { Typography } from 'antd';

import { CollectionElement } from '@/types/apiModels';
import { ScreenParamsContext } from '@/utils/screenParamsProvider';
import { Border, Canvas, InfoLabel, Scrollable, Wrapper } from './styled';
import useCanvasResize from './hooks/useCanvasResize';
import { Container } from '@/components/base/Grid';

interface EditorProps {
    element: CollectionElement;
}

const { Text } = Typography;

export default function Editor({ element }: EditorProps) {
    const [editedElement, setEditedElement] = useState<CollectionElement>(element);

    const { mockScreenParams, canvasParams, onBorderMouseDown, onMouseUp, canvasRef } = useCanvasResize();

    if (!editedElement) {
        return null;
    }

    return (
        <Wrapper onMouseUp={onMouseUp}>
            <Canvas ref={canvasRef as RefObject<HTMLDivElement>} style={canvasParams}>
                <Border
                    position="left"
                    onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => onBorderMouseDown(e, 'left')}
                />
                <Border
                    position="right"
                    onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => onBorderMouseDown(e, 'right')}
                />
                <InfoLabel>
                    <Text color="#ffffff">
                        {mockScreenParams.breakpoint}: {mockScreenParams.width}px
                    </Text>
                </InfoLabel>
                <ScreenParamsContext.Provider value={mockScreenParams}>
                    <Scrollable>
                        <Container>
                            <div style={{ height: 1000, width: '30%', margin: 'auto', backgroundColor: 'green' }}></div>
                        </Container>
                    </Scrollable>
                </ScreenParamsContext.Provider>
            </Canvas>
        </Wrapper>
    );
}
