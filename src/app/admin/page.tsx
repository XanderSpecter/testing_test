import { getElements } from '@/api/collection';
import View from '@/components/views/AdminCollection';
import getQueryClient from '@/utils/getQueryClient';
import Hydrate from '@/utils/hidrateClient';
import { dehydrate } from '@tanstack/query-core';

export default async function Admin() {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(['page'], () => getElements({ collectionElementName: 'page' }));
    const dehydratedState = dehydrate(queryClient);

    return (
        <Hydrate state={dehydratedState}>
            <View />
        </Hydrate>
    );
}

