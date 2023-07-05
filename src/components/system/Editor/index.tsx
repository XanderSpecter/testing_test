'use client';

import React, { useContext, useEffect, useState } from 'react';

import { CollectionElement } from '@/types/apiModels';
import Canvas from './components/Canvas';
import DragNDrop from './components/DragNDrop';
import { HeaderContentContext } from '../AdminLayout';
import { Button } from 'antd';
import { HeaderControls } from './styled';

interface EditorProps {
    element: CollectionElement;
}

export default function Editor({ element }: EditorProps) {
    const setHeaderContent = useContext(HeaderContentContext);
    const [editedElement, setEditedElement] = useState<CollectionElement>(element);

    const onSave = () => {
        console.log('saved');
    };

    useEffect(() => {
        if (setHeaderContent) {
            setHeaderContent(
                <HeaderControls>
                    <Button danger onClick={onSave}>
                        Отмена
                    </Button>
                    <Button onClick={onSave}>Сохранить</Button>
                </HeaderControls>
            );
        }
    }, [setHeaderContent]);

    if (!editedElement) {
        return null;
    }

    return (
        <Canvas>
            <DragNDrop onDrop={(style, shortcut) => console.log(style, shortcut)}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'red', borderRadius: '50%' }}></div>
            </DragNDrop>
        </Canvas>
    );
}
