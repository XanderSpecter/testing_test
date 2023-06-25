import Head from 'next/head';

import useUrl from '../src/hooks/utils/useUrl';

export default function Home() {
    const { path } = useUrl();

    return (
        <div>
            <Head>
                <title>Test Environtment</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>Здесь могла быть ваша реклама {path}</div>
        </div>
    );
}

