'use client';

import React from 'react';
import { ElementType, PageBlock } from '@/types/HTMLElements';
import BaseBlock from '@/components/base/BaseBlock';

interface RendererProps {
    blocks: PageBlock[];
}

export default function Renderer({ blocks }: RendererProps) {
    return blocks.map((b) => {
        if (b.type === ElementType.HTMLELEMENT) {
            return <BaseBlock key={b.editorId} {...b} />;
        }
    });
}
