'use client';

import React, { useState } from 'react';

import { CollectionElement } from '@/types/apiModels';
import Canvas from './components/Canvas';
import DragNDrop from './components/DragNDrop';

interface EditorProps {
    element: CollectionElement;
}

export default function Editor({ element }: EditorProps) {
    const [editedElement, setEditedElement] = useState<CollectionElement>(element);

    if (!editedElement) {
        return null;
    }

    return (
        <Canvas>
            <DragNDrop onDrop={(style, shortcut) => console.log(style, shortcut)}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'red' }}></div>
            </DragNDrop>
        </Canvas>
    );
}
