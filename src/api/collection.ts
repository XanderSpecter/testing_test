import { ObjectId } from 'mongodb';
import { handleRequest } from '../helpers/frontendApiHelpers';
import { BaseObject, CollectionElement, WithcollectionElementName } from '../types/apiModels';

export interface CreateElementParams<T extends BaseObject = BaseObject> extends WithcollectionElementName {
    element?: Partial<CollectionElement<T>>;
}
export interface EditElementParams<T extends BaseObject = BaseObject> extends WithcollectionElementName {
    element: CollectionElement<T>;
}

export interface DeleteElementParams extends WithcollectionElementName {
    _id: ObjectId;
}

export interface GetElementParams extends WithcollectionElementName {
    query?: BaseObject;
}

export const putElement = <T extends BaseObject = BaseObject>({
    element,
    collectionElementName,
}: CreateElementParams<T>) =>
    handleRequest({
        url: 'collection/create',
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
    handleRequest({
        url: 'collection/update',
        method: 'POST',
        data: {
            element,
            collectionElementName,
        },
    });

export const deleteElement = ({ _id, collectionElementName }: DeleteElementParams) =>
    handleRequest({
        url: 'collection/delete',
        method: 'DELETE',
        params: {
            _id,
            collectionElementName,
        },
    });

export const getElements = <T extends BaseObject = BaseObject>({ collectionElementName, query }: GetElementParams) =>
    handleRequest<CollectionElement<T>[]>({
        url: 'collection/get',
        method: 'GET',
        params: {
            collectionElementName,
            ...query,
        },
    });
