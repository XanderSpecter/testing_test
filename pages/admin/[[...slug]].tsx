import Head from 'next/head';

import useUrl from '../../src/utils/useUrl';

export default function Admin() {
    const { path } = useUrl();

    const renderRoutes = () => {
        return <div>{path}</div>;
    };

    return (
        <div>
            <Head>
                <title>Test Environtment</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {renderRoutes()}
        </div>
    );
}
