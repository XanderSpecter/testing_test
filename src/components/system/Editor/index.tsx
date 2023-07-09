'use client';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { set, get, unset } from 'lodash';
import { useRouter } from 'next/navigation';

import { CollectionElement, CollectionParams } from '@/types/apiModels';
import { PageBlock, ElementType, StylesByBreakpoint, PageContent } from '@/types/HTMLElements';
import { Routes } from '@/constants/appParams';
import Canvas from './components/Canvas';
import { HeaderContentContext } from '../AdminLayout';
import { Button } from 'antd';
import { HeaderControls } from './styled';
import { useElements } from '@/hooks/api/useElements';
import FullScreenLoader from '@/components/base/FullScreenLoader';
import { CANVAS_ID, CANVAS_RESIZER_ID, DRAG_N_DROP_DISABLED_DISPLAY } from './constants';
import ContextMenu, { ContextMenuProps, ContextOption, HandlerParams } from './components/ContextMenu';
import { getLocalStorageCache, recalcPath, saveLocalStorageCache } from './helpers';
import Form from './components/Form';
import Renderer from '../Renderer/RendererEditor';

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
    const [editedField, setEditedField] = useState<PageContent | null>();
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

    const onDrop = useCallback(
        (style: React.CSSProperties, screenShortcut: string) => {
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

            const { path } = updatedSelectedBlock;

            if (!path) {
                return;
            }

            const updatedField = set(editedField, recalcPath(path), updatedSelectedBlock);
            const updatedElement = { ...editedElement, [field]: updatedField };

            setSelectedBlock(updatedSelectedBlock);
            setEditedField(updatedField);
            setEditedElement(updatedElement);

            saveLocalStorageCache(updatedElement._id, updatedElement);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedBlock]
    );

    const onBlockFormSubmit = (block: PageBlock) => {
        if (!block || !editedField || !editedElement) {
            return;
        }

        const { path } = block;

        if (!path) {
            return;
        }

        const updatedField = set(editedField, recalcPath(path), block);
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

    const addChildBlock = ({ path }: HandlerParams) => {
        if (!path || !editedField || !currentMockedBreakpoint) {
            return;
        }

        setFormEditedBlockParent(path);
        setFormEditedBlock(null);
        setIsFormOpened(true);

        setContextParams({
            ...contextParams,
            path: null,
        });
    };

    const editBlock = ({ path }: HandlerParams) => {
        if (!path || !editedElement || !editedField) {
            return;
        }

        const block = get(editedField, recalcPath(path), null);

        if (block) {
            setFormEditedBlock(block);
            setIsFormOpened(true);

            setContextParams({
                ...contextParams,
                path: null,
            });
        }
    };

    const deleteBlock = ({ path }: HandlerParams) => {
        if (!path || !editedElement || !editedField) {
            return;
        }

        const updatedField = { ...editedField };

        const isDeleted = unset(updatedField, recalcPath(path));

        if (!isDeleted) {
            return;
        }

        const updatedElement = { ...editedElement, [field]: updatedField };

        setEditedField(updatedField);
        setEditedElement(updatedElement);

        saveLocalStorageCache(updatedElement._id, updatedElement);

        setContextParams({
            ...contextParams,
            path: null,
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
                setEditedField((cachedField || {}) as PageContent);

                return;
            }

            const newEditedField = elementsList[0][field];

            setEditedElement(elementsList[0]);
            setEditedField((newEditedField || {}) as PageContent);
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
        e.preventDefault();
        e.stopPropagation();

        setContextParams({
            ...contextParams,
            path: null,
        });

        if ((e.target as HTMLDivElement).dataset.path) {
            const { display } = getComputedStyle(e.target as HTMLDivElement);

            if (display === DRAG_N_DROP_DISABLED_DISPLAY) {
                return;
            }

            const block = get(editedField, recalcPath(String((e.target as HTMLDivElement).dataset.path)), null);

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

        if ((e.target as HTMLDivElement)?.dataset?.path) {
            const { target, pageX, pageY } = e;

            setContextParams({
                path: (target as HTMLDivElement).dataset.path,
                top: pageY,
                left: pageX,
            });
        }
    };

    return (
        <>
            <FullScreenLoader show={isLoading || !editedElement || !editedField} />
            <Canvas
                onCanvasClick={onCanvasClick}
                onContextMenu={onContextMenu}
                onBreakpointChange={(shortcut) => setCurrentMockedBreakpoint(shortcut)}
                onDrop={onDrop}
                selectedBlock={selectedBlock}
            >
                <Renderer content={editedField} />
            </Canvas>
            <Form
                block={formEditedBlock}
                opened={isFormOpened}
                path={formEditedBlockParent}
                onSubmit={onBlockFormSubmit}
                onCancel={() => setIsFormOpened(false)}
            />
            <ContextMenu {...contextParams} options={contextOptions} />
        </>
    );
}
