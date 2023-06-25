import { ObjectId } from 'mongodb';
import { handleRequest } from '../helpers/frontendApiHelpers';
import { CollectionElementData } from '../types/apiModels';

export const createElement = (data: CollectionElementData, collectionName: string) =>
    handleRequest({
        url: 'collection/create',
        method: 'PUT',
        data: {
            data,
            collectionName,
        },
    });

export const updateElement = (data: CollectionElementData, collectionName: string) =>
    handleRequest({
        url: 'collection/update',
        method: 'POST',
        data: {
            data,
            collectionName,
        },
    });

export const deleteElement = (_id: ObjectId, collectionName: string) =>
    handleRequest({
        url: 'collection/delete',
        method: 'DELETE',
        params: {
            _id,
            collectionName,
        },
    });

export const getElements = (collectionName: string) =>
    handleRequest<CollectionElementData[]>({
        url: 'collection/get',
        method: 'GET',
        params: {
            collectionName,
        },
    });
