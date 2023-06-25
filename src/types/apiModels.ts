import { ObjectId } from 'mongodb';

export type AllowedMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

export type BaseObject = Record<string, unknown>;

export interface CollectionElementData {
    _id?: ObjectId;
    body: BaseObject;
}

export interface CollectionRequestParams {
    _id?: ObjectId;
    data?: CollectionElementData;
    collectionName: string;
}
