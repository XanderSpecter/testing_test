import Head from 'next/head';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getRecords, saveRecord } from '../../../src/api/records';

import { useRecords } from '../../../src/hooks/api/useRecords';
import PageContainer from '../../../src/components/base/PageContainer';
import FullScreenLoader from '../../../src/components/base/FullScreenLoader';
import { Button } from 'antd';

const RecordsList = () => {
    const { data, isLoading, refetch } = useRecords();

    const [isFetching, setIsFetching] = useState(false);

    const addRecord = async () => {
        setIsFetching(true);

        await saveRecord(uuid(), { key: 'value' });

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
                <FullScreenLoader show={isLoading || isFetching || true} />
                {data?.map((record) => (
                    <div key={String(record._id)}>{JSON.stringify(record)}</div>
                ))}
                <Button onClick={addRecord}>Добавить</Button>
            </PageContainer>
        </div>
    );
};

export const getServerSideProps = async () => {
    const queryClient = new QueryClient();

    await queryClient.fetchQuery(['records'], () => getRecords());

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

export default RecordsList;
