import { handleRequest } from '../../helpers/frontendApiHelpers';

export const saveRecord = (pageName: string, pageData: Record<string, string>) =>
    handleRequest({
        url: 'records/save',
        method: 'POST',
        data: {
            pageName,
            pageData,
        },
    });

export const getRecords = () =>
    handleRequest({
        url: 'records/list',
        method: 'GET',
    });
