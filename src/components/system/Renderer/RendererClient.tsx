'use client';

import React from 'react';
import { ElementType, PageContent } from '@/types/HTMLElements';
import BaseBlock from '@/components/base/BaseBlock/BaseBlockClient';

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

        if (block.type === ElementType.HTMLELEMENT || block.type === ElementType.CONTAINER) {
            return <BaseBlock key={block.path} {...block} />;
        }
        if (block.type === ElementType.TEXT) {
            return block.value;
        }
    });
}
