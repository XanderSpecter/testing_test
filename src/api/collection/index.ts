import { ObjectId } from 'mongodb';
import { BaseObject, CollectionElement, Collection } from '../../types/apiModels';
import { handleRequest } from '../utils/handleRequest';

export interface CreateElementParams<T extends BaseObject = BaseObject> extends Collection {
    element?: Partial<CollectionElement<T>>;
}
export interface EditElementParams<T extends BaseObject = BaseObject> extends Collection {
    element: CollectionElement<T>;
}

export interface DeleteElementParams extends Collection {
    _id: ObjectId;
}

export interface GetElementParams extends Collection {
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
}: EditElementParams<T>) =>
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
