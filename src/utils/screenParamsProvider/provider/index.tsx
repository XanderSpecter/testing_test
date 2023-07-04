'use client';

import React, { useContext, useEffect, useState } from 'react';
import { throttle } from 'lodash';

import { DEFAULT_SCREEN_PARAMS, ScreenParams, ScreenParamsContext } from '../context';
import { BreakpointsContext } from '@/utils/breakpointsProvider';
import { calculateCurrentScreenParams } from '../helpers';

const SCREEN_PARAMS_UPDATE_DELAY = 300;

interface ScreenParamsProviderProps {
    mockScreenParams?: ScreenParams;
}

function ScreenParamsProvider({ children, mockScreenParams }: React.PropsWithChildren<ScreenParamsProviderProps>) {
    const [params, setParams] = useState<ScreenParams>(mockScreenParams || DEFAULT_SCREEN_PARAMS);

    const breakpoints = useContext(BreakpointsContext);

    const updateScreenParams = throttle(
        () => setParams(calculateCurrentScreenParams(breakpoints)),
        SCREEN_PARAMS_UPDATE_DELAY
    );

    useEffect(() => {
        if (mockScreenParams || !window || typeof window === 'undefined') {
            return;
        }

        setParams(calculateCurrentScreenParams(breakpoints));

        window.addEventListener('resize', updateScreenParams);
        window.addEventListener('scroll', updateScreenParams);

        () => {
            window.removeEventListener('resize', updateScreenParams);
            window.removeEventListener('scroll', updateScreenParams);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breakpoints]);

    return <ScreenParamsContext.Provider value={params}>{children}</ScreenParamsContext.Provider>;
}

export default ScreenParamsProvider;
