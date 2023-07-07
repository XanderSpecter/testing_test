import { ObjectId } from 'mongodb';
import { BaseCollectionElementParams, BaseObject, CollectionElement, CollectionParams } from '../../types/apiModels';
import { handleRequest } from '../utils/handleRequest';

export interface CreateElementParams<T extends BaseCollectionElementParams = BaseCollectionElementParams>
    extends CollectionParams {
    element: Partial<CollectionElement<T>>;
}
export interface UpdateElementParams<T extends BaseCollectionElementParams = BaseCollectionElementParams>
    extends CollectionParams {
    element: CollectionElement<T>;
}

export interface DeleteElementParams extends CollectionParams {
    _id: ObjectId;
}

export interface GetElementParams extends CollectionParams {
    query?: BaseObject;
}

export const putElement = <T extends BaseCollectionElementParams = BaseCollectionElementParams>({
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

export const postElement = <T extends BaseCollectionElementParams = BaseCollectionElementParams>({
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

export const getElements = <T extends BaseCollectionElementParams = BaseCollectionElementParams>({
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
