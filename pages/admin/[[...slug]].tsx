import Head from 'next/head';

import useUrl from '../../src/hooks/utils/useUrl';
import CollectionPage from '../../src/components/admin/CollectionPage';

const ADMIN_PANEL_TITLE = 'Панель администратора';

export default function Admin() {
    const { path } = useUrl();

    const renderRoutes = () => {
        if (path.includes('page')) {
            return <CollectionPage title={ADMIN_PANEL_TITLE} />;
        }

        return <div>{path}</div>;
    };

    return (
        <div>
            <Head>
                <title>{ADMIN_PANEL_TITLE}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {renderRoutes()}
        </div>
    );
}
