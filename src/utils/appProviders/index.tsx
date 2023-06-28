'use client';

import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import StyledComponentsRegistry from './StyledComponentsRegistry';

function Providers({ children }: React.PropsWithChildren) {
    const [client] = React.useState(new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }));

    return (
        <QueryClientProvider client={client}>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </QueryClientProvider>
    );
}

export default Providers;
