import Head from 'next/head';
import { useRouter } from 'next/router';
import Section from '../src/components/structure/Section';

export default function Home() {
    const router = useRouter();

    console.log(router);

    return (
        <div>
            <Head>
                <title>Test Environtment</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Section
                styles={{
                    width: '100%',
                    height: '200px',
                }}
            >
                Здесь могла быть ваша реклама
            </Section>
        </div>
    );
}

