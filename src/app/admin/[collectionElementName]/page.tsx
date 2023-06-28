import { dehydrate } from '@tanstack/query-core';
import { Metadata } from 'next';

import { getElements } from '@/api/collection';
import AdminCollection from '@/components/views/AdminCollection';
import getQueryClient from '@/utils/queryClient/getQueryClient';
import Hydrate from '@/utils/queryClient/hidrateClient';
import { BaseObject, Collection } from '@/types/apiModels';
import { DEFAULT_APP_TITLE } from '@/constants/appParams';

interface CollectionPageProps {
    params: Collection;
    searchParams: BaseObject;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
    const { collectionElementName } = params;

    return {
        title: `Коллекция-${collectionElementName}-${DEFAULT_APP_TITLE}`,
    };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
    const { collectionElementName } = params;

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery([collectionElementName], () =>
        getElements({ collectionElementName, query: searchParams })
    );
    const dehydratedState = dehydrate(queryClient);

    return (
        <Hydrate state={dehydratedState}>
            <AdminCollection collectionElementName={collectionElementName} query={searchParams} />
        </Hydrate>
    );
}

