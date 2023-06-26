'use client';

import { v4 as uuid } from 'uuid';
import FullScreenLoader from '@/components/base/FullScreenLoader';
import { useElements } from '@/hooks/api/useElements';

import { Button } from 'antd';
import { Collection } from '@/types/apiModels';

export default function AdminCollection({ collectionElementName }: Collection) {
    const { elementsList, isLoading, createElement, updateElement, removeElement } = useElements({
        collectionElementName,
    });

    return (
        <>
            <FullScreenLoader show={isLoading} />
            {elementsList?.map((record) => (
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }} key={String(record._id)}>
                    {JSON.stringify(record)}
                    <div style={{ marginLeft: '8px' }}>
                        <Button onClick={() => updateElement({ ...record, name: `updated-${uuid()}` })}>
                            Обновить
                        </Button>
                    </div>
                    <div style={{ marginLeft: '8px' }}>
                        <Button onClick={() => removeElement(record._id)}>Удалить</Button>
                    </div>
                </div>
            ))}
            <Button onClick={() => createElement()}>Добавить</Button>
        </>
    );
}