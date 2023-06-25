import { ObjectId, WithId } from 'mongodb';

export type AllowedMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

export type BaseObject = Record<string, unknown>;

export interface WithcollectionElementName {
    collectionElementName: string;
}

export type CollectionElement<T extends BaseObject = BaseObject> = WithId<T>;

export interface CollectionRequestParams extends WithcollectionElementName {
    _id?: ObjectId;
    element?: CollectionElement;
}
