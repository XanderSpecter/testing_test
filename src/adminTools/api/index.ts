import { handleRequest } from '../../helpers/frontendApiHelpers';

export const savePage = (pageName: string, pageData: Record<string, string>) =>
    handleRequest({
        url: 'savePage',
        method: 'POST',
        data: {
            pageName,
            pageData,
        },
    });
