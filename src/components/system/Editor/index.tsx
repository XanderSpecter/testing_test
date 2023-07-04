'use client';

import React, { useState } from 'react';

import { CollectionElement } from '@/types/apiModels';
import { Container } from '@/components/base/Grid';
import Canvas from './components/Canvas';

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
            <Container>123</Container>
        </Canvas>
    );
}
