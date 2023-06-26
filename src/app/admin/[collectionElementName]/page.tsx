import { dehydrate } from '@tanstack/query-core';

import { getElements } from '@/api/collection';
import AdminCollection from '@/components/views/AdminCollection';
import getQueryClient from '@/utils/getQueryClient';
import Hydrate from '@/utils/hidrateClient';
import { Collection } from '@/types/apiModels';

interface CollectionPageProps {
    params: Collection;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { collectionElementName } = params;

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(['page'], () => getElements({ collectionElementName }));
    const dehydratedState = dehydrate(queryClient);

    return (
        <Hydrate state={dehydratedState}>
            <AdminCollection collectionElementName={collectionElementName} />
        </Hydrate>
    );
}

