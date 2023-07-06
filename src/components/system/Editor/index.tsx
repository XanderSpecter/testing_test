'use client';

import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/navigation';
import { PlusOutlined } from '@ant-design/icons';

import { CollectionElement, CollectionParams } from '@/types/apiModels';
import { BaseBlockParams, StylesByBreakpoint } from '@/types/HTMLElements';
import { Routes } from '@/constants/appParams';
import Canvas from './components/Canvas';
import DragNDrop from './components/DragNDrop';
import { HeaderContentContext } from '../AdminLayout';
import { Button } from 'antd';
import { HeaderControls, NewBlockButton } from './styled';
import { useElements } from '@/hooks/api/useElements';
import FullScreenLoader from '@/components/base/FullScreenLoader';
import BaseBlock from '../../base/BaseBlock';

interface EditorProps extends CollectionParams {
    id: string;
    field: string;
}

export default function Editor({ id, field, collectionElementName }: EditorProps) {
    const setHeaderContent = useContext(HeaderContentContext);

    const router = useRouter();

    const { elementsList, isLoading, updateElement, isOperationRunning } = useElements({
        collectionElementName,
        query: { _id: id },
    });

    const [editedElement, setEditedElement] = useState<CollectionElement | null>();
    const [editedField, setEditedField] = useState<BaseBlockParams[] | null>();
    const [selectedBlock, setSelectedBlock] = useState<BaseBlockParams | null>(null);
    const [currentMockedBreakpoint, setCurrentMockedBreakpoint] = useState<string | null>(null);

    const onSave = () => {
        if (!editedElement) {
            return;
        }

        updateElement(editedElement);
    };

    const clearAndExit = () => {
        localStorage.removeItem(id);

        router.push(`${Routes.ADMIN}/${collectionElementName}`);
    };

    useEffect(() => {
        if (isOperationRunning === false) {
            clearAndExit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOperationRunning]);

    const onDrop = (style: React.CSSProperties, screenShortcut: string) => {
        if (!selectedBlock || !editedElement || !editedField) {
            return;
        }

        let updatedStyles: StylesByBreakpoint = {};

        const { stylesByBreakpoint } = selectedBlock;

        if (!stylesByBreakpoint) {
            updatedStyles[screenShortcut] = style;
        } else {
            updatedStyles = { ...stylesByBreakpoint, [screenShortcut]: style };
        }

        const updatedSelectedBlock = { ...selectedBlock, stylesByBreakpoint: updatedStyles };
        const updatedField = editedField.map((b) => {
            if (b.editorId === updatedSelectedBlock.editorId) {
                return updatedSelectedBlock;
            }

            return b;
        });
        const updatedElement = { ...editedElement, [field]: updatedField };

        setSelectedBlock(updatedSelectedBlock);
        setEditedField(updatedField);
        setEditedElement(updatedElement);

        localStorage.setItem(String(updatedElement._id), JSON.stringify(updatedElement));
    };

    const addBlock = () => {
        if (!editedField || !currentMockedBreakpoint) {
            return;
        }

        const newBlock: BaseBlockParams = {
            tag: 'div',
            editorId: uuid(),
            stylesByBreakpoint: {
                all: {
                    height: 50,
                    backgroundColor: 'red',
                },
            },
        };

        setEditedField([...editedField, newBlock]);
    };

    useEffect(() => {
        if (elementsList && elementsList.length === 1) {
            const newEditedField = elementsList[0][field];
            const id = elementsList[0]._id;

            if (!newEditedField || !Array.isArray(newEditedField) || !newEditedField.length) {
                const cache = localStorage.getItem(String(id));

                if (cache) {
                    const cachedElement: CollectionElement = JSON.parse(cache);
                    const cachedField = cachedElement[field];

                    setEditedElement(cachedElement);
                    setEditedField(Array.isArray(cachedField) ? cachedField : []);

                    return;
                }
            }

            setEditedElement(elementsList[0]);
            setEditedField(Array.isArray(newEditedField) ? newEditedField : []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementsList]);

    useEffect(() => {
        if (setHeaderContent) {
            setHeaderContent(
                <HeaderControls>
                    <Button danger onClick={() => clearAndExit()}>
                        Отмена
                    </Button>
                    <Button onClick={() => onSave()}>Сохранить</Button>
                </HeaderControls>
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHeaderContent, editedElement]);

    const onCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).dataset.editorId) {
            const block = editedField?.find((b) => b.editorId === (e.target as HTMLDivElement).dataset.editorId);

            if (block) {
                setSelectedBlock(block);
            }
        }
    };

    const renderBlocks = () => {
        if (!Array.isArray(editedField)) {
            return null;
        }

        return editedField.map((e) => {
            if (e.editorId === selectedBlock?.editorId) {
                return (
                    <DragNDrop stylesByBreakpoint={e.stylesByBreakpoint} key={e.editorId} onDrop={onDrop}>
                        <BaseBlock tag={e.tag} editorId={e.editorId} />
                    </DragNDrop>
                );
            }

            return <BaseBlock key={e.editorId} {...e} />;
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
