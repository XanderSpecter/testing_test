'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { CollectionElement, CollectionParams } from '@/types/apiModels';
import { PageBlock, ElementType, StylesByBreakpoint, StyledBlock } from '@/types/HTMLElements';
import { Routes } from '@/constants/appParams';
import Canvas from './components/Canvas';
import DragNDrop from './components/DragNDrop';
import { HeaderContentContext } from '../AdminLayout';
import { Button } from 'antd';
import { EmptyBlock, HeaderControls } from './styled';
import { useElements } from '@/hooks/api/useElements';
import FullScreenLoader from '@/components/base/FullScreenLoader';
import BaseBlock from '../../base/BaseBlock';
import { CANVAS_ID, CANVAS_RESIZER_ID, DRAG_N_DROP_DISABLED_DISPLAY, EMPTY_BLOCK_MESSAGE } from './constants';
import ContextMenu, { ContextMenuProps, ContextOption, HandlerParams } from './components/ContextMenu';
import { getLocalStorageCache, saveLocalStorageCache } from './helpers';
import Form from './components/Form';

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
    const [formEditedBlock, setFormEditedBlock] = useState<PageBlock | null>(null);
    const [formEditedBlockParent, setFormEditedBlockParent] = useState<string | null>(null);
    const [isFormOpened, setIsFormOpened] = useState(false);
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
        if (!selectedBlock || selectedBlock.type !== ElementType.HTMLELEMENT || !editedElement || !editedField) {
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

        saveLocalStorageCache(updatedElement._id, updatedElement);
    };

    const onBlockFormSubmit = (block: PageBlock) => {
        if (!block || !editedField || !editedElement) {
            return;
        }

        let isUpdate = false;

        const updatedField = editedField.map((b) => {
            if (b.editorId === block.editorId) {
                isUpdate = true;

                return block;
            }

            return b;
        });

        if (!isUpdate) {
            updatedField.push(block);
        }

        const updatedElement = { ...editedElement, [field]: updatedField };

        setEditedField(updatedField);
        setEditedElement(updatedElement);

        saveLocalStorageCache(updatedElement._id, updatedElement);
        setIsFormOpened(false);
    };

    const addBlock = () => {
        if (!editedField || !currentMockedBreakpoint) {
            return;
        }

        setFormEditedBlock(null);
        setIsFormOpened(true);
    };

    const addChildBlock = ({ editorId }: HandlerParams) => {
        if (!editorId || !editedField || !currentMockedBreakpoint) {
            return;
        }

        setFormEditedBlockParent(editorId);
        setFormEditedBlock(null);
        setIsFormOpened(true);

        setContextParams({
            ...contextParams,
            editorId: null,
        });
    };

    const editBlock = ({ editorId }: HandlerParams) => {
        if (!editorId || !editedElement || !editedField) {
            return;
        }

        const block = editedField.find((b) => b.editorId === editorId);

        if (block) {
            setFormEditedBlock(block);
            setIsFormOpened(true);

            setContextParams({
                ...contextParams,
                editorId: null,
            });
        }
    };

    const deleteBlock = ({ editorId }: HandlerParams) => {
        if (!editorId || !editedElement || !editedField) {
            return;
        }

        const updatedField = editedField.filter((b) => b.editorId !== editorId);
        const updatedElement = { ...editedElement, [field]: updatedField };

        setEditedField(updatedField);
        setEditedElement(updatedElement);

        saveLocalStorageCache(updatedElement._id, updatedElement);

        setContextParams({
            ...contextParams,
            editorId: null,
        });
    };

    const contextOptions: ContextOption[] = useMemo(
        () => [
            {
                name: 'Добавить дочерний элемент',
                handler: addChildBlock,
            },
            {
                name: 'Редактировать',
                handler: editBlock,
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
            const id = elementsList[0]._id;
            const cachedElement = getLocalStorageCache(String(id));

            if (
                cachedElement &&
                cachedElement.lastUpdate &&
                elementsList[0].lastUpdate &&
                cachedElement.lastUpdate > elementsList[0].lastUpdate
            ) {
                const cachedField = cachedElement[field];

                setEditedElement(cachedElement);
                setEditedField(Array.isArray(cachedField) ? cachedField : []);

                return;
            }

            const newEditedField = elementsList[0][field];

            setEditedElement(elementsList[0]);
            setEditedField(Array.isArray(newEditedField) ? newEditedField : []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementsList]);

    useEffect(() => {
        if (setHeaderContent) {
            setHeaderContent(
                <HeaderControls>
                    <Button type="primary" onClick={addBlock}>
                        Добавить элемент
                    </Button>
                    <Button danger onClick={() => clearAndExit()}>
                        Закрыть редактор
                    </Button>
                    <Button onClick={() => onSave()}>Сохранить и выйти</Button>
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
            const { display } = getComputedStyle(e.target as HTMLDivElement);

            if (display === DRAG_N_DROP_DISABLED_DISPLAY) {
                return;
            }

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

    const renderBlockContent = (block: StyledBlock) => {
        if (block.content) {
            return block.content;
        }

        return <EmptyBlock>{EMPTY_BLOCK_MESSAGE}</EmptyBlock>;
    };

    const renderBlocks = () => {
        if (!Array.isArray(editedField)) {
            return null;
        }

        return editedField.map((e) => {
            if (e.type === ElementType.HTMLELEMENT) {
                if (e.editorId === selectedBlock?.editorId) {
                    return (
                        <DragNDrop
                            stylesByBreakpoint={e.stylesByBreakpoint}
                            tag={e.tag}
                            key={e.editorId}
                            onDrop={onDrop}
                        >
                            <BaseBlock type={e.type} tag={e.tag} editorId={e.editorId}>
                                {renderBlockContent(e)}
                            </BaseBlock>
                        </DragNDrop>
                    );
                }

                return (
                    <BaseBlock key={e.editorId} {...e}>
                        {renderBlockContent(e)}
                    </BaseBlock>
                );
            }

            return (
                <BaseBlock key={e.editorId} {...e} stylesByBreakpoint={null} tag="span" type={ElementType.HTMLELEMENT}>
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
            </Canvas>
            <Form
                block={formEditedBlock}
                opened={isFormOpened}
                parent={formEditedBlockParent}
                onSubmit={onBlockFormSubmit}
                onCancel={() => setIsFormOpened(false)}
            />
            <ContextMenu {...contextParams} options={contextOptions} />
        </>
    );
}
