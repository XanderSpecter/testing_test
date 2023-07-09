'use client';

import React from 'react';
import { EditorContext, EditorContextParams } from '../context';

function EditorProvider({ children, editing, selectedBlock, onDrop }: React.PropsWithChildren<EditorContextParams>) {
    return <EditorContext.Provider value={{ selectedBlock, editing, onDrop }}>{children}</EditorContext.Provider>;
}

export default EditorProvider;
