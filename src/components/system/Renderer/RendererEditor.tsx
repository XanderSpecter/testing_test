'use client';

import React from 'react';
import { ElementType, PageContent } from '@/types/HTMLElements';
import BaseBlock from '@/components/base/BaseBlock/BaseBlockEditor';
import { EmptyBlock } from './styled';
import { EMPTY_BLOCK_MESSAGE } from './constants';

interface RendererProps {
    content?: PageContent | null;
}

export default function Renderer({ content }: RendererProps) {
    if (!content) {
        return null;
    }

    return Object.keys(content).map((k) => {
        const block = content[k];

        if (!block) {
            return null;
        }

        if (block.type === ElementType.HTMLELEMENT) {
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
}
