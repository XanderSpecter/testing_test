'use client';

import React, { RefObject } from 'react';
import { Typography } from 'antd';

import { DnDInfoLabel, DnDResizer, DragNDropWrapper } from './styled';
import { DnDResizerPosition } from './styled/DnDResizer';
import useDragNDrop, { DragNDropProps } from './useDragNDrop';
import { HTMLTag } from '@/types/HTMLElements';

const { Text } = Typography;

interface DragNDropComponentProps extends DragNDropProps {
    tag: HTMLTag;
}

export default function DragNDrop({
    children,
    $stylesByBreakpoint,
    onDrop,
    tag,
}: React.PropsWithChildren<DragNDropComponentProps>) {
    const { dndRef, calculatedStyle, isStatic, onDnDMouseDown } = useDragNDrop({
        $stylesByBreakpoint,
        onDrop,
    });

    const left = calculatedStyle.marginLeft || calculatedStyle.left || '0px';
    const top = calculatedStyle.marginTop || calculatedStyle.top || '0px';

    if (!calculatedStyle) {
        return children;
    }

    return (
        <DragNDropWrapper
            onMouseDown={onDnDMouseDown}
            style={calculatedStyle}
            ref={dndRef as RefObject<HTMLDivElement>}
            as={tag}
        >
            <DnDResizer data-pos={DnDResizerPosition.TOP} position={DnDResizerPosition.TOP} />
            <DnDResizer data-pos={DnDResizerPosition.RIGHT} position={DnDResizerPosition.RIGHT} />
            <DnDResizer data-pos={DnDResizerPosition.BOTTOM} position={DnDResizerPosition.BOTTOM} />
            <DnDResizer data-pos={DnDResizerPosition.LEFT} position={DnDResizerPosition.LEFT} />
            <DnDInfoLabel>
                <Text>Позиционирование: {isStatic ? 'Относительное' : 'Абсолютное'}</Text>
                <br />
                <Text>
                    Ширина:{' '}
                    {typeof calculatedStyle.width === 'number'
                        ? `${Math.round(calculatedStyle.width)}px`
                        : calculatedStyle.width}
                </Text>
                {calculatedStyle.height && (
                    <>
                        <br />
                        <Text>
                            Высота:{' '}
                            {typeof calculatedStyle.height === 'number'
                                ? `${calculatedStyle.height}px`
                                : calculatedStyle.height}
                        </Text>
                    </>
                )}
                {left && (
                    <>
                        <br />
                        <Text>Слева: {typeof left === 'number' ? `${left}px` : left}</Text>
                    </>
                )}
                {top && (
                    <>
                        <br />
                        <Text>Сверху: {typeof top === 'number' ? `${top}px` : top}</Text>
                    </>
                )}
            </DnDInfoLabel>
            {children}
        </DragNDropWrapper>
    );
}
