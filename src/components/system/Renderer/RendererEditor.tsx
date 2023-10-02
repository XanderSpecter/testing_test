'use client';

import React from 'react';
import { ElementType, PageBlock, PageContent } from '@/types/HTMLElements';
import BaseBlock from '@/components/base/BaseBlock/BaseBlockEditor';
import { EmptyBlock } from './styled';
import { EMPTY_BLOCK_MESSAGE, EMPTY_CONTAINER_MESSAGE, EMPTY_ROW_MESSAGE } from './constants';

interface RendererProps {
    content?: PageContent | null;
}

export default function Renderer({ content }: RendererProps) {
    if (!content) {
        return null;
    }

    const renderEmptyMessage = (type: PageBlock['type']) => {
        switch (type) {
            case ElementType.CONTAINER:
                return EMPTY_CONTAINER_MESSAGE;
            case ElementType.ROW:
                return EMPTY_ROW_MESSAGE;
            default:
                return EMPTY_BLOCK_MESSAGE;
        }
    };

    return Object.keys(content).map((k) => {
        const block = content[k];

        if (!block) {
            return null;
        }

        if (
            block.type === ElementType.HTMLELEMENT ||
            block.type === ElementType.CONTAINER ||
            block.type === ElementType.ROW
        ) {
            return (
                <BaseBlock key={block.path} {...block}>
                    <EmptyBlock>{renderEmptyMessage(block.type)}</EmptyBlock>
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
}
