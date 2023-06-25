import { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'node:querystring';

export const getUrlParams = <Params extends ParsedUrlQuery = ParsedUrlQuery, Preview extends PreviewData = PreviewData>(
    context: GetServerSidePropsContext<Params, Preview>
) => {
    const { query, resolvedUrl } = context;

    const path = resolvedUrl.split('?')[0];
    const slug = path.split('/').filter((s) => !!s);

    console.log(resolvedUrl, path);

    return {
        resolvedUrl,
        path,
        slug,
        query,
    };
};
