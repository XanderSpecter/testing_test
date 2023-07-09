'use client';

import React, { useContext, useMemo } from 'react';
import { ElementType, PageContent } from '@/types/HTMLElements';
import BaseBlock from '@/components/base/BaseBlock';
import { EditorContext } from '@/utils/editorProvider';
import DragNDrop from '../Editor/components/DragNDrop';
import { EmptyBlock } from './styled';
import { EMPTY_BLOCK_MESSAGE } from './constants';

interface RendererProps {
    content?: PageContent | null;
}

export default function Renderer({ content }: RendererProps) {
    const { editing, selectedBlock, onDrop } = useContext(EditorContext);

    const isEditingMode = useMemo(() => editing && typeof onDrop === 'function', [editing, onDrop]);

    const renderEditableBlocks = () => {
        if (!content) {
            return null;
        }

        return Object.keys(content).map((k) => {
            const block = content[k];

            if (!block) {
                return null;
            }

            if (block.type === ElementType.HTMLELEMENT) {
                if (block.path === selectedBlock?.path) {
                    return (
                        <DragNDrop
                            stylesByBreakpoint={block.stylesByBreakpoint}
                            tag={block.tag}
                            key={block.path}
                            onDrop={onDrop}
                        >
                            <BaseBlock type={block.type} tag={block.tag} path={block.path}>
                                <EmptyBlock>{EMPTY_BLOCK_MESSAGE}</EmptyBlock>
                            </BaseBlock>
                        </DragNDrop>
                    );
                }

                return (
                    <BaseBlock key={block.path} {...block}>
                        <EmptyBlock>{EMPTY_BLOCK_MESSAGE}</EmptyBlock>
                    </BaseBlock>
                );
            }
            if (block.type === ElementType.TEXT) {
                return (
                    <BaseBlock key={block.path} {...block} type={ElementType.HTMLELEMENT} tag="span">
                        {block.value}
                    </BaseBlock>
                );
            }
        });
    };

    const renderClientBlocks = () => {
        if (!content) {
            return null;
        }

        return Object.keys(content).map((k) => {
            const block = content[k];

            if (!block) {
                return null;
            }

            if (block.type === ElementType.HTMLELEMENT) {
                return <BaseBlock key={block.path} {...block} />;
            }
            if (block.type === ElementType.TEXT) {
                return block.value;
            }
        });
    };

    return <>{isEditingMode ? renderEditableBlocks() : renderClientBlocks()}</>;
}
