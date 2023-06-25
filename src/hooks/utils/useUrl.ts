import { useRouter } from 'next/router';
import { useMemo } from 'react';

const useUrl = () => {
    const router = useRouter();

    const {
        query: { slug, ...rest },
        asPath,
    } = router;

    const path = useMemo(() => asPath.split('?')[0], [asPath]);
    const computedSlug = useMemo(() => path.split('/').filter((s) => !!s), [path]);

    return {
        resolvedUrl: asPath,
        path,
        slug: slug || computedSlug,
        query: { ...rest },
    };
};

export default useUrl;
