'use client';

import React from 'react';
import { HeaderWrapper } from '../styled';

export default function Header({ children }: React.PropsWithChildren) {
    return <HeaderWrapper>{children}</HeaderWrapper>;
}
