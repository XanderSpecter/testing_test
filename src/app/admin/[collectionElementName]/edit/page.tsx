import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { dehydrate } from '@tanstack/query-core';

import Editor from '@/components/system/Editor';
import getQueryClient from '@/utils/queryClient/getQueryClient';
import Hydrate from '@/utils/queryClient/hidrateClient';
import { getElements } from '@/api/collection';
import { CollectionParams, PossibleFieldType } from '@/types/apiModels';
import { checkIsCollectionAvailable, getMappedFieldParams } from '@/utils/collections';
import { DEFAULT_APP_TITLE } from '@/constants/appParams';

interface ElementParams {
    id: string;
    field: string;
}

interface EditorPageProps {
    params: CollectionParams;
    searchParams: ElementParams;
}

export async function generateMetadata({ params, searchParams }: EditorPageProps): Promise<Metadata> {
    const { collectionElementName } = params;
    const { id } = searchParams;

    let title = 'Редактирование';

    const elements = await getElements({ collectionElementName, query: { _id: decodeURIComponent(id) } });

    if (elements && elements.length === 1) {
        title += ` ${elements[0].name}`;
    }

    return {
        title: `${title}-${DEFAULT_APP_TITLE}`,
    };
}

export default async function EditorPage({ params, searchParams }: EditorPageProps) {
    const { id, field } = searchParams;
    const { collectionElementName } = params;

    if (!collectionElementName || !id || !field) {
        notFound();
    }

    const parsedId = decodeURIComponent(id);
    const parsedField = decodeURIComponent(field);

    const isCollectionAvailable = checkIsCollectionAvailable(collectionElementName);
    const fieldParams = getMappedFieldParams(collectionElementName, parsedField);

    if (!isCollectionAvailable || !fieldParams || fieldParams.type !== PossibleFieldType.EDITOR) {
        notFound();
    }

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery([collectionElementName], () =>
        getElements({ collectionElementName, query: { _id: parsedId } })
    );
    const dehydratedState = dehydrate(queryClient);

    return (
        <Hydrate state={dehydratedState}>
            <Editor id={parsedId} field={parsedField} collectionElementName={collectionElementName} />
        </Hydrate>
    );
}
