import { ObjectId } from 'mongodb';
import { handleRequest } from '../helpers/frontendApiHelpers';
import { BaseObject, CollectionElementData } from '../types/apiModels';

export const createElement = <T extends BaseObject = BaseObject>(
    data: CollectionElementData<T>,
    collectionName: string
) =>
    handleRequest({
        url: 'collection/create',
        method: 'PUT',
        data: {
            data,
            collectionName,
        },
    });

export const updateElement = <T extends BaseObject = BaseObject>(
    data: CollectionElementData<T>,
    collectionName: string
) =>
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

export const getElements = <T extends BaseObject = BaseObject>(collectionName: string, searchParams?: BaseObject) =>
    handleRequest<CollectionElementData<T>[]>({
        url: 'collection/get',
        method: 'GET',
        params: {
            collectionName,
            ...searchParams,
        },
    });
