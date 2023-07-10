'use client';

import React, { RefObject, useMemo } from 'react';
import { Typography } from 'antd';

import { DnDInfoLabel, DnDResizer, DnDResizerLabel, DnDResizerLabelRay, DragNDropWrapper } from './styled';
import { DnDResizerPosition } from './styled/DnDResizer';
import useDragNDrop, { DragNDropProps } from './useDragNDrop';
import { DnDResizerLabelProps } from './styled/DnDResizerLabel';
import { recalcWidthAndOffsets } from './helpers';
import { HTMLTag } from '@/types/HTMLElements';

const { Text } = Typography;

interface DragNDropComponentProps extends DragNDropProps {
    tag: HTMLTag;
}

export default function DragNDrop({
    children,
    stylesByBreakpoint,
    onDrop,
    tag,
}: React.PropsWithChildren<DragNDropComponentProps>) {
    const { dndRef, calculatedStyle, isStatic, screenWidth, onDnDMouseDown, onMouseUp } = useDragNDrop({
        stylesByBreakpoint,
        onDrop,
    });

    const { calculatedOffsetLeft, calculatedOffsetRight } = useMemo(
        () =>
            recalcWidthAndOffsets({
                width: calculatedStyle?.width || 0,
                offsetLeft: calculatedStyle?.marginLeft || 0,
                screenWidth,
            }),
        [calculatedStyle, screenWidth]
    );

    if (!calculatedStyle) {
        return children;
    }

    const renderDistanceLabel = ({ position, distanceLabel, distance }: DnDResizerLabelProps) => {
        if (!position || !distance || !distanceLabel) {
            return null;
        }

        return (
            <DnDResizerLabel position={position} distanceLabel={distanceLabel} distance={distance}>
                <DnDResizerLabelRay position={position} distance={distance} role="before" />
                <Text>{typeof distanceLabel === 'number' ? Math.round(distanceLabel) : distanceLabel}</Text>
                <DnDResizerLabelRay position={position} distance={distance} role="after" />
            </DnDResizerLabel>
        );
    };

    return (
        <DragNDropWrapper
            onMouseDown={onDnDMouseDown}
            onMouseUp={onMouseUp}
            style={calculatedStyle}
            ref={dndRef as RefObject<HTMLDivElement>}
            as={tag}
        >
            <DnDResizer data-pos={DnDResizerPosition.TOP} position={DnDResizerPosition.TOP}>
                {renderDistanceLabel({
                    position: DnDResizerPosition.TOP,
                    distanceLabel: calculatedStyle.top || calculatedStyle.marginTop,
                    distance: parseInt(String(calculatedStyle.top)) || parseInt(String(calculatedStyle.marginTop)),
                })}
            </DnDResizer>
            <DnDResizer data-pos={DnDResizerPosition.RIGHT} position={DnDResizerPosition.RIGHT}>
                {renderDistanceLabel({
                    position: DnDResizerPosition.RIGHT,
                    distanceLabel: calculatedStyle.right || calculatedStyle.marginRight,
                    distance: parseInt(String(calculatedStyle.right)) || calculatedOffsetRight,
                })}
            </DnDResizer>
            <DnDResizer data-pos={DnDResizerPosition.BOTTOM} position={DnDResizerPosition.BOTTOM} />
            <DnDResizer data-pos={DnDResizerPosition.LEFT} position={DnDResizerPosition.LEFT}>
                {renderDistanceLabel({
                    position: DnDResizerPosition.LEFT,
                    distanceLabel: calculatedStyle.left || calculatedStyle.marginLeft,
                    distance: parseInt(String(calculatedStyle.left)) || calculatedOffsetLeft,
                })}
            </DnDResizer>
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
            </DnDInfoLabel>
            {children}
        </DragNDropWrapper>
    );
}
