import { dehydrate } from '@tanstack/query-core';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getElements } from '@/api/collection';
import Collection from '@/components/system/Collection';
import getQueryClient from '@/utils/queryClient/getQueryClient';
import Hydrate from '@/utils/queryClient/hidrateClient';
import { BaseObject, Collection } from '@/types/apiModels';
import { DEFAULT_APP_TITLE } from '@/constants/appParams';
import { checkIsCollectionAvailable, getCollectionParams } from '@/utils/collections';

interface CollectionPageProps {
    params: Collection;
    searchParams: BaseObject;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
    const { collectionElementName } = params;

    const collectionTitle = getCollectionParams(collectionElementName)?.title || `Коллекция ${collectionElementName}`;

    return {
        title: `${collectionTitle}-${DEFAULT_APP_TITLE}`,
    };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
    const { collectionElementName } = params;

    const isCollectionAvailable = checkIsCollectionAvailable(collectionElementName);

    if (!isCollectionAvailable) {
        notFound();
    }

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery([collectionElementName], () =>
        getElements({ collectionElementName, query: searchParams })
    );
    const dehydratedState = dehydrate(queryClient);

    return (
        <Hydrate state={dehydratedState}>
            <Collection collectionElementName={collectionElementName} query={searchParams} />
        </Hydrate>
    );
}

