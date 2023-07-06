import { notFound } from 'next/navigation';
import { getElements } from '@/api/collection';
import { BASE_URL } from '@/constants/appParams';
import Renderer from '@/components/system/Renderer';
import { BaseObject } from '@/types/apiModels';
import { concatUrlFromPathParams } from '@/utils/url';
import { BaseBlockParams } from '@/types/HTMLElements';

interface Path {
    pathParams?: string | string[];
}

interface HomeParams {
    params: Path;
    searchParams: BaseObject;
}

export default async function Home({ params }: HomeParams) {
    const { pathParams } = params;

    const url = concatUrlFromPathParams(BASE_URL, pathParams);

    const pages = await getElements({ collectionElementName: 'page', query: { url } });

    if (!pages || pages.length !== 1) {
        notFound();
    }

    if (!pages[0].content) {
        notFound();
    }

    return <Renderer blocks={(pages[0].content || []) as BaseBlockParams[]} />;
}

