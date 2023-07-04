'use client';

import React from 'react';
import { EditorContext } from '../context';

interface EditorProviderProps {
    editing: boolean;
}

function EditorProvider({ children, editing }: React.PropsWithChildren<EditorProviderProps>) {
    return <EditorContext.Provider value={editing}>{children}</EditorContext.Provider>;
}

export default EditorProvider;
