'use client';

import { v4 as uuid } from 'uuid';
import { useMemo } from 'react';
import FullScreenLoader from '@/components/base/FullScreenLoader';
import { useElements } from '@/hooks/api/useElements';

import { Button } from 'antd';
import { BaseObject, Collection } from '@/types/apiModels';
import { AVAILABLE_COLLECTIONS } from '@/constants/collections';
import { Container } from '@/components/base/Grid';

interface AdminCollectionProps extends Collection {
    query: BaseObject;
}

export default function AdminCollection({ collectionElementName, query }: AdminCollectionProps) {
    const { elementsList, isLoading, createElement, updateElement, removeElement } = useElements({
        collectionElementName,
        query,
    });

    const currentCollection = useMemo(
        () => AVAILABLE_COLLECTIONS.find((c) => c.name === collectionElementName),
        [collectionElementName]
    );

    return (
        <Container>
            <FullScreenLoader show={isLoading} />
            <Button onClick={() => createElement({})}>Добавить</Button>
        </Container>
    );
}
