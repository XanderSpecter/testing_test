'use client';

import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import StyledComponentsRegistry from './StyledComponentsRegistry';
import { BreakpointsProvider } from '../breakpointsProvider';
import { ScreenParamsProvider } from '../screenParamsProvider';
import { EditorProvider } from '../editorProvider';

function Providers({ children }: React.PropsWithChildren) {
    const [client] = React.useState(new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }));

    return (
        <QueryClientProvider client={client}>
            <BreakpointsProvider>
                <ScreenParamsProvider>
                    <EditorProvider editor={false}>
                        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
                    </EditorProvider>
                </ScreenParamsProvider>
            </BreakpointsProvider>
        </QueryClientProvider>
    );
}

export default Providers;
