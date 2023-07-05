'use client';

import React from 'react';
import Header from './components/Header';

export default function AdminLayout({ children }: React.PropsWithChildren) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
