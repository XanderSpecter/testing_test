import Head from 'next/head';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ObjectId } from 'mongodb';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { Button } from 'antd';

import { getElements, createElement, updateElement, deleteElement } from '../../../src/api/collection';
import { useElements } from '../../../src/hooks/api/useElements';
import PageContainer from '../../../src/components/base/PageContainer';
import FullScreenLoader from '../../../src/components/base/FullScreenLoader';
import { CollectionElementData } from '../../../src/types/apiModels';

const RecordsList = () => {
    const { data, isLoading, refetch } = useElements();

    const [isFetching, setIsFetching] = useState(false);

    const addRecord = async () => {
        setIsFetching(true);

        await createElement({ body: { name: uuid(), key: 'value' } }, 'records');

        setIsFetching(false);
        refetch();
    };

    const updateRecord = async (record: CollectionElementData) => {
        setIsFetching(true);

        await updateElement({ _id: record._id, body: { ...record.body, name: `updated-${uuid()}` } }, 'records');

        setIsFetching(false);
        refetch();
    };

    const deleteRecord = async (_id: CollectionElementData['_id']) => {
        setIsFetching(true);

        await deleteElement(_id as ObjectId, 'records');

        setIsFetching(false);
        refetch();
    };

    return (
        <div>
            <Head>
                <title>Список записей БД</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageContainer>
                <FullScreenLoader show={isLoading || isFetching} />
                {data?.map((record) => (
                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }} key={String(record._id)}>
                        {JSON.stringify(record)}
                        <div style={{ marginLeft: '8px' }}>
                            <Button onClick={() => updateRecord(record)}>Обновить</Button>
                        </div>
                        <div style={{ marginLeft: '8px' }}>
                            <Button onClick={() => deleteRecord(record._id)}>Удалить</Button>
                        </div>
                    </div>
                ))}
                <Button onClick={addRecord}>Добавить</Button>
            </PageContainer>
        </div>
    );
};

export const getServerSideProps = async () => {
    const queryClient = new QueryClient();

    await queryClient.fetchQuery(['records'], () => getElements('records'));

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

export default RecordsList;
