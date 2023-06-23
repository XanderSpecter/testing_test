import { WithId } from 'mongodb';
import { handleRequest } from '../helpers/frontendApiHelpers';

export const saveRecord = (name: string, data: Record<string, string>) =>
    handleRequest({
        url: 'records/save',
        method: 'POST',
        data: {
            name,
            data,
        },
    });

export const getRecords = () =>
    handleRequest<WithId<Record<string, string>>[]>({
        url: 'records/list',
        method: 'GET',
    });
