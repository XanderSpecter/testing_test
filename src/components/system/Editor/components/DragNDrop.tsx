'use client';

import React, { RefObject } from 'react';

import { DnDResizer, DragNDropWrapper } from '../styled';
import { DnDResizerPosition } from '../styled/DnDResizer';
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
            <DnDResizer data-pos={DnDResizerPosition.TOP} position={DnDResizerPosition.TOP} />
            <DnDResizer data-pos={DnDResizerPosition.RIGHT} position={DnDResizerPosition.RIGHT} />
            <DnDResizer data-pos={DnDResizerPosition.BOTTOM} position={DnDResizerPosition.BOTTOM} />
            <DnDResizer data-pos={DnDResizerPosition.LEFT} position={DnDResizerPosition.LEFT} />
            {children}
        </DragNDropWrapper>
    );
}