'use client';

import React from 'react';
import { Breakpoint, BreakpointsContext, DEFAULT_BREAKPOINTS } from '../context';
import { useElements } from '@/hooks/api/useElements';

function BreakpointsProvider({ children }: React.PropsWithChildren) {
    const { elementsList } = useElements<Breakpoint>({ collectionElementName: 'breakpoints' });

    const hasCustomBreakpoints = elementsList && Array.isArray(elementsList) && elementsList.length > 0;

    const breakpoints = hasCustomBreakpoints
        ? elementsList.map((b) => ({ name: b.name, screen: b.screen, maxCols: b.maxCols }))
        : DEFAULT_BREAKPOINTS;

    return <BreakpointsContext.Provider value={breakpoints}>{children}</BreakpointsContext.Provider>;
}

export default BreakpointsProvider;
