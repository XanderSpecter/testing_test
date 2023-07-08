'use client';

import React from 'react';
import { ChildrenContext } from '../context';
import { PageBlock } from '@/types/HTMLElements';

interface ChildrenProviderProps {
    blocks: PageBlock[];
}

function ChildrenProvider({ children, blocks }: React.PropsWithChildren<ChildrenProviderProps>) {
    return <ChildrenContext.Provider value={blocks}>{children}</ChildrenContext.Provider>;
}

export default ChildrenProvider;
