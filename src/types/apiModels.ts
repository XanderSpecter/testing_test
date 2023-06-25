import { ObjectId } from 'mongodb';

export type AllowedMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

export type BaseObject = Record<string, unknown>;

export interface CollectionElementData<T extends BaseObject = BaseObject> {
    _id?: ObjectId;
    body: T;
}

export interface CollectionRequestParams {
    _id?: ObjectId;
    data?: CollectionElementData;
    collectionName: string;
}
