import Head from 'next/head';
import { useRouter } from 'next/router';
import DBTestPage from '../../src/adminTools/DbTestPage';

export default function Admin() {
    const router = useRouter();

    if (typeof router.query.slug === 'string' && router.query.slug.toLowerCase() === 'dbtest') {
        return (
            <div>
                <Head>
                    <title>Test Environtment</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <DBTestPage />
            </div>
        );
    }

    return (
        <div>
            <Head>
                <title>Test Environtment</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>Здесь могла быть реклама админа</div>
        </div>
    );
}
