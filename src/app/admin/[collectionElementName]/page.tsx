import { dehydrate } from '@tanstack/query-core';

import { getElements } from '@/api/collection';
import AdminCollection from '@/components/views/AdminCollection';
import getQueryClient from '@/utils/getQueryClient';
import Hydrate from '@/utils/hidrateClient';
import { BaseObject, Collection } from '@/types/apiModels';

interface CollectionPageProps {
    params: Collection;
    searchParams: BaseObject;
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

