'use client';

import React, { createContext, useState } from 'react';
import Header from './components/Header';

export const HeaderContentContext = createContext<React.Dispatch<React.SetStateAction<React.ReactNode>>>(() => null);

export default function AdminLayout({ children }: React.PropsWithChildren) {
    const [headerContent, setHeaderContent] = useState<React.ReactNode>(null);

    return (
        <HeaderContentContext.Provider value={setHeaderContent}>
            <Header>{headerContent}</Header>
            {children}
        </HeaderContentContext.Provider>
    );
}
