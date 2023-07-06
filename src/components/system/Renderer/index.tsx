'use client';

import React from 'react';
import { BaseBlockParams } from '@/types/HTMLElements';
import BaseBlock from '@/components/base/BaseBlock';

interface RendererProps {
    blocks: BaseBlockParams[];
}

export default function Renderer({ blocks }: RendererProps) {
    return blocks.map((b) => <BaseBlock key={b.editorId} {...b} />);
}
