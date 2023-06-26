import { getElements } from '@/api/collection';
import getQueryClient from '@/utils/getQueryClient';
import Hydrate from '@/utils/hidrateClient';
import { dehydrate } from '@tanstack/query-core';
import View from './View';

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

