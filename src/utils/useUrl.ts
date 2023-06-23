import { useRouter } from 'next/router';
import { useMemo } from 'react';

const useUrl = () => {
    const router = useRouter();

    const {
        query: { slug, ...rest },
    } = router;

    const path = useMemo(() => (Array.isArray(slug) ? slug.join('/') : slug), [slug]);

    return {
        path: path || '',
        slug,
        params: { ...rest },
    };
};

export default useUrl;
