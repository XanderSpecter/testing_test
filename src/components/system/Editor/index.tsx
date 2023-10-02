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
import { deleteFromLocalStorage } from '@/utils/localStorage';
import { CANVAS_ID, CANVAS_RESIZER_ID, DRAG_N_DROP_DISABLED_DISPLAY } from './constants';
import ContextMenu, { ContextMenuProps, ContextOption, HandlerParams } from './components/ContextMenu';
import { createEmptyPageBlock, getLocalStorageCache, recalcPath, saveLocalStorageCache } from './helpers';
import Form from './components/Form';
import Renderer from '../Renderer/RendererEditor';

interface EditorProps extends CollectionParams {
    id: string;
    field: string;
}

export default function Editor({ id, field, collectionElementName }: EditorProps) {
    const setHeaderContent = useContext(HeaderContentContext);

    const router = useRouter();

    const { elementsList, isLoading, updateElement } = useElements({
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
        deleteFromLocalStorage(id);

        router.push(`${Routes.ADMIN}/${collectionElementName}`);
    };

    const onDrop = useCallback(
        (style: React.CSSProperties, screenShortcut: string) => {
            if (!selectedBlock || selectedBlock.type !== ElementType.HTMLELEMENT || !editedElement || !editedField) {
                return;
            }

            let updatedStyles: StylesByBreakpoint = {};

            const { $stylesByBreakpoint } = selectedBlock;

            if (!$stylesByBreakpoint) {
                updatedStyles[screenShortcut] = style;
            } else {
                updatedStyles = { ...$stylesByBreakpoint, [screenShortcut]: style };
            }

            const updatedSelectedBlock = { ...selectedBlock, $stylesByBreakpoint: updatedStyles };

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

    const addGridRow = ({ path, grid }: HandlerParams) => {
        if (grid === ElementType.CONTAINER) {
            const newRow = createEmptyPageBlock(ElementType.ROW, path);

            if (newRow) {
                onBlockFormSubmit(newRow);
            }

            setContextParams({
                ...contextParams,
                path: null,
            });
        } else if (grid === ElementType.ROW) {
            const containerPathParams = path?.split('.');

            if (!containerPathParams) {
                setContextParams({
                    ...contextParams,
                    path: null,
                });

                return;
            }

            containerPathParams?.splice(-1);

            const containerPath =
                containerPathParams?.length > 1 ? containerPathParams?.join('.') : containerPathParams[0];

            const newRow = createEmptyPageBlock(ElementType.ROW, containerPath);

            if (newRow) {
                onBlockFormSubmit(newRow);
            }

            setContextParams({
                ...contextParams,
                path: null,
            });
        }
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
        () => {
            const options = [
                {
                    name: 'Редактировать',
                    handler: editBlock,
                },
                {
                    name: 'Удалить',
                    handler: deleteBlock,
                },
            ];

            if (contextParams.grid === ElementType.CONTAINER) {
                options.push({
                    name: 'Добавить строку',
                    handler: addGridRow,
                });
            }

            if (contextParams.grid === ElementType.ROW) {
                options.push({
                    name: 'Добавить строку ниже',
                    handler: addGridRow,
                });
            }

            if (!contextParams.grid || contextParams.grid === ElementType.ROW) {
                options.push({
                    name: 'Добавить дочерний элемент',
                    handler: addChildBlock,
                });
            }

            return options;
        },
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
                    <Button onClick={() => onSave()}>Сохранить изменения</Button>
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

            const grid = (e.target as HTMLDivElement)?.dataset?.grid as ElementType;

            setContextParams({
                path: (target as HTMLDivElement).dataset.path,
                top: pageY,
                left: pageX,
                grid,
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
