import Head from 'next/head';

import Section from '../src/components/structure/Section';
import useUrl from '../src/hooks/utils/useUrl';

export default function Home() {
    const urlData = useUrl();

    return (
        <div>
            <Head>
                <title>Test Environtment</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Section
                customStyles={{
                    width: '100%',
                    height: '200px',
                }}
            >
                Здесь могла быть ваша реклама
            </Section>
        </div>
    );
}

