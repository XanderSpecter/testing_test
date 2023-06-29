'use client';

import { BaseObject } from '@/types/apiModels';
import { createContext } from 'react';

export interface Breakpoint extends BaseObject {
    name: string;
    screen: number;
    maxCols: number;
}

export type WithBreakpoints<T> = Omit<T, 'breakpoints'> & {
    breakpoints: Breakpoint[];
};

export const DEFAULT_BREAKPOINTS: Breakpoint[] = [
    {
        name: 'mobile',
        screen: 0,
        maxCols: 4,
    },
    {
        name: 'tablet',
        screen: 768,
        maxCols: 12,
    },
    {
        name: 'desktop',
        screen: 1280,
        maxCols: 12,
    },
];

export const BreakpointsContext = createContext<Breakpoint[]>(DEFAULT_BREAKPOINTS);
