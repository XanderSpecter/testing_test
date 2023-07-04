import { ObjectId } from 'mongodb';
import { BaseObject, CollectionElement, CollectionParams } from '../../types/apiModels';
import { handleRequest } from '../utils/handleRequest';

export interface CreateElementParams<T extends BaseObject = BaseObject> extends CollectionParams {
    element: Partial<CollectionElement<T>>;
}
export interface UpdateElementParams<T extends BaseObject = BaseObject> extends CollectionParams {
    element: CollectionElement<T>;
}

export interface DeleteElementParams extends CollectionParams {
    _id: ObjectId;
}

export interface GetElementParams extends CollectionParams {
    query?: BaseObject;
}

export const putElement = <T extends BaseObject = BaseObject>({
    element,
    collectionElementName,
}: CreateElementParams<T>) =>
    handleRequest<void>({
        url: 'collection',
        method: 'PUT',
        data: {
            element,
            collectionElementName,
        },
    });

export const postElement = <T extends BaseObject = BaseObject>({
    element,
    collectionElementName,
}: UpdateElementParams<T>) =>
    handleRequest<void>({
        url: 'collection',
        method: 'POST',
        data: {
            element,
            collectionElementName,
        },
    });

export const deleteElement = ({ _id, collectionElementName }: DeleteElementParams) =>
    handleRequest<void>({
        url: 'collection',
        method: 'DELETE',
        params: {
            _id,
            collectionElementName,
        },
    });

export const getElements = <T extends BaseObject = BaseObject>({
    collectionElementName,
    query = {},
}: GetElementParams) =>
    handleRequest<CollectionElement<T>[]>({
        url: 'collection',
        method: 'GET',
        params: {
            collectionElementName,
            ...query,
        },
    });
