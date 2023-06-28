'use client';

import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import StyledComponentsRegistry from './StyledComponentsRegistry';
import { BreakpointsProvider } from '../breakpointsProvider';
import { ScreenParamsProvider } from '../screenParamsProvider';

function Providers({ children }: React.PropsWithChildren) {
    const [client] = React.useState(new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }));

    return (
        <QueryClientProvider client={client}>
            <BreakpointsProvider>
                <ScreenParamsProvider>
                    <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
                </ScreenParamsProvider>
            </BreakpointsProvider>
        </QueryClientProvider>
    );
}

export default Providers;
