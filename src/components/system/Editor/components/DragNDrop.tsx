'use client';

import React, { RefObject } from 'react';
import { Typography } from 'antd';

import { DnDInfoLabel, DnDResizer, DnDResizerLabel, DragNDropWrapper } from '../styled';
import { DnDResizerPosition } from '../styled/DnDResizer';
import useDragNDrop, { DragNDropProps } from '../hooks/useDragNDrop';

const { Text } = Typography;

export default function DragNDrop({ children, stylesByBreakpoint, onDrop }: React.PropsWithChildren<DragNDropProps>) {
    const { dndRef, calculatedStyle, isStatic, onDnDMouseDown, onMouseUp } = useDragNDrop({
        stylesByBreakpoint,
        onDrop,
    });

    if (!calculatedStyle) {
        return children;
    }

    return (
        <DragNDropWrapper
            onMouseDown={onDnDMouseDown}
            onMouseUp={onMouseUp}
            style={calculatedStyle}
            ref={dndRef as RefObject<HTMLDivElement>}
        >
            <DnDResizer data-pos={DnDResizerPosition.TOP} position={DnDResizerPosition.TOP}>
                <DnDResizerLabel
                    position={DnDResizerPosition.TOP}
                    distance={calculatedStyle.top || calculatedStyle.marginTop}
                >
                    <Text>{calculatedStyle.top || calculatedStyle.marginTop}</Text>
                </DnDResizerLabel>
            </DnDResizer>
            <DnDResizer data-pos={DnDResizerPosition.RIGHT} position={DnDResizerPosition.RIGHT} />
            <DnDResizer data-pos={DnDResizerPosition.BOTTOM} position={DnDResizerPosition.BOTTOM} />
            <DnDResizer data-pos={DnDResizerPosition.LEFT} position={DnDResizerPosition.LEFT} />
            <DnDInfoLabel>
                <Text>Позиционирование: {isStatic ? 'Относительное' : 'Абсолютное'}</Text>
                <br />
                <Text>
                    Ширина:{' '}
                    {typeof calculatedStyle.width === 'number' ? `${calculatedStyle.width}px` : calculatedStyle.width}
                </Text>
            </DnDInfoLabel>
            {children}
        </DragNDropWrapper>
    );
}
