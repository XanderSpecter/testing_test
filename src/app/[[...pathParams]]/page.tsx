import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getElements } from '@/api/collection';
import { BASE_URL, DEFAULT_APP_TITLE } from '@/constants/appParams';
import Renderer from '@/components/system/Renderer';
import { BaseObject } from '@/types/apiModels';
import { concatUrlFromPathParams } from '@/utils/url';
import { PageBlock } from '@/types/HTMLElements';

interface Path {
    pathParams?: string | string[];
}

interface HomeParams {
    params: Path;
    searchParams: BaseObject;
}

export async function generateMetadata({ params }: HomeParams): Promise<Metadata> {
    const { pathParams } = params;

    const url = concatUrlFromPathParams(BASE_URL, pathParams);

    const pages = await getElements({ collectionElementName: 'page', query: { url } });

    if (pages && pages.length === 1 && pages[0].name) {
        return { title: `${pages[0].name}-${DEFAULT_APP_TITLE}` };
    }

    return {
        title: DEFAULT_APP_TITLE,
    };
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

    return <Renderer blocks={(pages[0].content || []) as PageBlock[]} />;
}

