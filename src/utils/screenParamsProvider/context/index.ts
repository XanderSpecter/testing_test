'use client';

import { createContext } from 'react';

export interface ScreenParams {
    width: number;
    height: number;
    breakpoint: string;
    verticalScrollOffset: number;
}

export const DEFAULT_SCREEN_PARAMS: ScreenParams = {
    width: 0,
    height: 0,
    verticalScrollOffset: 0,
    breakpoint: 'mobile',
};

export const ScreenParamsContext = createContext<ScreenParams>(DEFAULT_SCREEN_PARAMS);
