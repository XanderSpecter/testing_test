'use client';

import React from 'react';
import Header from './components/Header';

export default function AdminLayout({ children }: React.PropsWithChildren) {
    return (
        <>
            <Header>123</Header>
            <div style={{ minHeight: '200vh' }}>{children}</div>
        </>
    );
}
