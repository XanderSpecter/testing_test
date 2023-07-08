'use client';

import { PageBlock } from '@/types/HTMLElements';
import { createContext } from 'react';

export const ChildrenContext = createContext<PageBlock[]>([]);
