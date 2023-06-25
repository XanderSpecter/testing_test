import { ObjectId, WithId } from 'mongodb';

export type PossibleMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

export type BaseObject = Record<string, unknown>;

export interface WithcollectionElementName extends BaseObject {
    collectionElementName: string;
}

export type CollectionElement<T extends BaseObject = BaseObject> = WithId<T>;

export interface CollectionRequestParams extends WithcollectionElementName {
    _id?: ObjectId;
    element?: CollectionElement;
    [key: string]: unknown;
}

export interface CollectionPostRequestParams extends WithcollectionElementName {
    _id: ObjectId;
    element: CollectionElement;
    [key: string]: unknown;
}
