'use client';

import React from 'react';
import { EditorContext } from '../context';

interface EditorProviderProps {
    editor: boolean;
}

function EditorProvider({ children, editor }: React.PropsWithChildren<EditorProviderProps>) {
    return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>;
}

export default EditorProvider;
