'use client';

import { PageBlock } from '@/types/HTMLElements';
import { createContext } from 'react';

export interface EditorContextParams {
    editing: boolean;
    selectedBlock?: PageBlock | null;
    onDrop?: (style: React.CSSProperties, screenShortcut: string) => void;
}

const DEFAULT_EDITING_PARAMS = { editing: false };

export const EditorContext = createContext<EditorContextParams>(DEFAULT_EDITING_PARAMS);
