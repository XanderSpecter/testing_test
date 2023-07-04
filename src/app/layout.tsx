import Providers from '@/utils/appProviders';
import { DEFAULT_APP_TITLE } from '@/constants/appParams';
import PageContainer from '@/components/base/PageContainer';

import '../styles/reset.css';
import '../styles/reset.css';

export const metadata = {
    title: DEFAULT_APP_TITLE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru">
            <body>
                <Providers>
                    <PageContainer>{children}</PageContainer>
                </Providers>
            </body>
        </html>
    );
}

