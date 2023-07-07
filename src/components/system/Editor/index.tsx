'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/navigation';
import { PlusOutlined } from '@ant-design/icons';

import { CollectionElement, CollectionParams } from '@/types/apiModels';
import { PageBlock, ElementType, StylesByBreakpoint } from '@/types/HTMLElements';
import { Routes } from '@/constants/appParams';
import Canvas from './components/Canvas';
import DragNDrop from './components/DragNDrop';
import { HeaderContentContext } from '../AdminLayout';
import { Button } from 'antd';
import { HeaderControls, NewBlockButton } from './styled';
import { useElements } from '@/hooks/api/useElements';
import FullScreenLoader from '@/components/base/FullScreenLoader';
import BaseBlock from '../../base/BaseBlock';
import { CANVAS_ID, CANVAS_RESIZER_ID } from './constants';
import ContextMenu, { ContextMenuProps, ContextOption } from './components/ContextMenu';

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
    const [editedField, setEditedField] = useState<PageBlock[] | null>();
    const [selectedBlock, setSelectedBlock] = useState<PageBlock | null>(null);
    const [currentMockedBreakpoint, setCurrentMockedBreakpoint] = useState<string | null>(null);
    const [contextParams, setContextParams] = useState<ContextMenuProps>({ top: 0, left: 0 });

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
            updatedStyles.all = style;
        } else {
            updatedStyles = { ...stylesByBreakpoint, [screenShortcut]: style, all: style };
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

        const newBlock: PageBlock = {
            type: ElementType.HTMLELEMENT,
            editorId: uuid(),
            tag: 'div',
            stylesByBreakpoint: {
                all: {
                    height: 50,
                    backgroundColor: 'red',
                },
            },
        };

        setEditedField([...editedField, newBlock]);
    };

    const copyBlock = (editorId: PageBlock['editorId']) => {
        if (!editorId || !editedElement || !editedField) {
            return;
        }

        const block = editedField.find((b) => b.editorId === editorId);

        if (block) {
            const copy = {
                ...block,
                editorId: uuid(),
            };

            const updatedField = [...editedField, copy];
            const updatedElement = { ...editedElement, [field]: updatedField };

            setEditedField(updatedField);
            setEditedElement(updatedElement);

            localStorage.setItem(String(updatedElement._id), JSON.stringify(updatedElement));

            setSelectedBlock(copy);

            setContextParams({
                ...contextParams,
                editorId: null,
            });
        }
    };

    const deleteBlock = (editorId: PageBlock['editorId']) => {
        if (!editorId || !editedElement || !editedField) {
            return;
        }

        const updatedField = editedField.filter((b) => b.editorId !== editorId);
        const updatedElement = { ...editedElement, [field]: updatedField };

        setEditedField(updatedField);
        setEditedElement(updatedElement);

        localStorage.setItem(String(updatedElement._id), JSON.stringify(updatedElement));

        setContextParams({
            ...contextParams,
            editorId: null,
        });
    };

    const contextOptions: ContextOption[] = useMemo(
        () => [
            {
                name: 'Копировать',
                handler: copyBlock,
            },
            {
                name: 'Редактировать',
                handler: (id) => console.log(id),
            },
            {
                name: 'Удалить',
                handler: deleteBlock,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [contextParams]
    );

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
        setContextParams({
            ...contextParams,
            editorId: null,
        });

        if ((e.target as HTMLDivElement).dataset.editorId) {
            const block = editedField?.find((b) => b.editorId === (e.target as HTMLDivElement).dataset.editorId);

            if (block) {
                setSelectedBlock(block);
            }

            return;
        }

        if ((e.target as HTMLDivElement).id === CANVAS_ID || (e.target as HTMLDivElement).id === CANVAS_RESIZER_ID) {
            setSelectedBlock(null);
        }
    };

    const onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if ((e.target as HTMLDivElement)?.dataset?.editorId) {
            const { target, pageX, pageY } = e;

            setContextParams({
                editorId: (target as HTMLDivElement).dataset.editorId,
                top: pageY,
                left: pageX,
            });
        }
    };

    const renderBlocks = () => {
        if (!Array.isArray(editedField)) {
            return null;
        }

        return editedField.map((e) => {
            if (e.type === ElementType.HTMLELEMENT) {
                if (e.editorId === selectedBlock?.editorId) {
                    return (
                        <DragNDrop stylesByBreakpoint={e.stylesByBreakpoint} key={e.editorId} onDrop={onDrop}>
                            <BaseBlock type={e.type} tag={e.tag} editorId={e.editorId} />
                        </DragNDrop>
                    );
                }

                return <BaseBlock key={e.editorId} {...e} />;
            }

            return (
                <BaseBlock key={e.editorId} {...e} tag="span" type={ElementType.HTMLELEMENT}>
                    {e.value}
                </BaseBlock>
            );
        });
    };

    return (
        <>
            <FullScreenLoader show={isLoading || !editedElement || !editedField} />
            <Canvas
                onCanvasClick={onCanvasClick}
                onContextMenu={onContextMenu}
                onBreakpointChange={(shortcut) => setCurrentMockedBreakpoint(shortcut)}
            >
                {renderBlocks()}
                <NewBlockButton>
                    <Button type="primary" shape="circle" onClick={addBlock}>
                        <PlusOutlined />
                    </Button>
                </NewBlockButton>
            </Canvas>
            <ContextMenu {...contextParams} options={contextOptions} />
        </>
    );
}
