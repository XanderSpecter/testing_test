'use client';

import React, { RefObject } from 'react';

import { DragNDropWrapper } from '../styled';
import useDragNDrop, { UseDragNDropParams } from '../hooks/useDragNDrop';

export default function DragNDrop({ children, style, onDrop }: React.PropsWithChildren<UseDragNDropParams>) {
    const { dndRef, calculatedStyle, onDnDMouseDown, onMouseUp } = useDragNDrop({ style, onDrop });

    return (
        <DragNDropWrapper
            onMouseDown={onDnDMouseDown}
            onMouseUp={onMouseUp}
            style={calculatedStyle}
            ref={dndRef as RefObject<HTMLDivElement>}
        >
            {children}
        </DragNDropWrapper>
    );
}
