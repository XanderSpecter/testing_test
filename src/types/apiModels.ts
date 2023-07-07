import { ObjectId, WithId } from 'mongodb';

export enum PossibleMethod {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum PossibleFieldType {
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    HIDDEN = 'HIDDEN',
    EDITOR = 'EDITOR',
}

export type FormEditableFieldType = Exclude<PossibleFieldType, PossibleFieldType.EDITOR | PossibleFieldType.HIDDEN>;

export type FieldsErrors = Record<string, string>;

export type BaseObject = Record<string, unknown>;

export interface CollectionParams extends BaseObject {
    collectionElementName: string;
}

export interface BaseCollectionElementParams extends BaseObject {
    _id?: ObjectId;
    name?: string;
    lastUpdate?: number;
}

export type CollectionElement<T extends BaseCollectionElementParams = BaseCollectionElementParams> = WithId<T>;

export interface CollectionRequestParams extends CollectionParams {
    _id?: ObjectId;
    element?: CollectionElement;
    sortKey?: string;
    [key: string]: unknown;
}

export interface CollectionPostRequestParams extends CollectionParams {
    _id: ObjectId;
    element: CollectionElement;
    [key: string]: unknown;
}
