import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import { v4 as uuid } from 'uuid';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { Button } from 'antd';

import { getElements } from '../../../src/api/collection';
import { useElements } from '../../../src/hooks/api/useElements';
import PageContainer from '../../../src/components/base/PageContainer';
import FullScreenLoader from '../../../src/components/base/FullScreenLoader';
import { getUrlParams } from '../../../src/helpers/serverRenderHelpers/getUrlParams';
import useUrl from '../../../src/hooks/utils/useUrl';

const PageList: NextPage = () => {
    const { slug, query } = useUrl();

    const collectionElementName = slug[slug.length - 1];

    const { elementsList, isLoading, createElement, updateElement, removeElement } = useElements({
        collectionElementName,
        query,
    });

    return (
        <div>
            <Head>
                <title>Список записей БД</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageContainer>
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
            </PageContainer>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug, query } = getUrlParams(context);

    const collectionElementName = slug[slug.length - 1];

    const queryClient = new QueryClient();

    await queryClient.fetchQuery([collectionElementName], () => getElements({ collectionElementName, query }));

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

export default PageList;
