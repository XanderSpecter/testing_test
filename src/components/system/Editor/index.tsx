'use client';

import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { CollectionElement, CollectionParams } from '@/types/apiModels';
import { BaseElementParams } from '@/types/HTMLElements';
import Canvas from './components/Canvas';
import DragNDrop from './components/DragNDrop';
import { HeaderContentContext } from '../AdminLayout';
import { Button } from 'antd';
import { HeaderControls, NewBlockButton } from './styled';
import { useElements } from '@/hooks/api/useElements';
import FullScreenLoader from '@/components/base/FullScreenLoader';
import BaseElement from './components/BaseElement';
import { PlusOutlined } from '@ant-design/icons';

interface EditorProps extends CollectionParams {
    id: string;
    field: string;
}

export default function Editor({ id, field, collectionElementName }: EditorProps) {
    const setHeaderContent = useContext(HeaderContentContext);

    const { elementsList, isLoading } = useElements({
        collectionElementName,
        query: { _id: id },
    });

    const [editedElement, setEditedElement] = useState<CollectionElement | null>();
    const [editedField, setEditedField] = useState<BaseElementParams[] | null>();
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [currentMockedBreakpoint, setCurrentMockedBreakpoint] = useState<string | null>(null);

    const onSave = () => {
        console.log(elementsList);
    };

    const addBlock = () => {
        if (!editedField || !currentMockedBreakpoint) {
            return;
        }

        const newBlock: BaseElementParams = {
            tag: 'div',
            editorId: uuid(),
            stylesByBreakpoint: {
                [currentMockedBreakpoint]: {
                    height: '50px',
                    backgroundColor: 'red',
                },
            },
        };

        setEditedField([...editedField, newBlock]);
    };

    useEffect(() => {
        if (elementsList && elementsList.length === 1) {
            setEditedElement(elementsList[0]);

            const newEditedField = elementsList[0][field];

            setEditedField(Array.isArray(newEditedField) ? newEditedField : []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementsList]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHeaderContent]);

    const onCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).dataset.editorId) {
            setSelectedElement(String((e.target as HTMLDivElement).dataset.editorId));
        }
    };

    const renderBlocks = () => {
        if (!Array.isArray(editedField)) {
            return null;
        }

        return editedField.map((e) => {
            if (e.editorId === selectedElement) {
                return (
                    <DragNDrop
                        stylesByBreakpoint={e.stylesByBreakpoint}
                        key={e.editorId}
                        onDrop={(style, shortcut) => console.log(style, shortcut)}
                    >
                        <BaseElement tag={e.tag} editorId={e.editorId} />
                    </DragNDrop>
                );
            }

            return <BaseElement key={e.editorId} {...e} />;
        });
    };

    return (
        <>
            <FullScreenLoader show={isLoading || !editedElement || !editedField} />
            <Canvas
                onCanvasClick={onCanvasClick}
                onBreakpointChange={(shortcut) => setCurrentMockedBreakpoint(shortcut)}
            >
                {renderBlocks()}
                <NewBlockButton>
                    <Button type="primary" shape="circle" onClick={addBlock}>
                        <PlusOutlined />
                    </Button>
                </NewBlockButton>
            </Canvas>
        </>
    );
}
