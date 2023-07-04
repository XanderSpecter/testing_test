import { ObjectId, WithId } from 'mongodb';

export type PossibleMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

export type PossibleFieldType = 'string' | 'number' | 'boolean' | 'object' | 'hidden';
export type FormEditableFieldType = Exclude<PossibleFieldType, 'object' | 'hidden'>;

export type FieldsErrors = Record<string, string>;

export type BaseObject = Record<string, unknown>;

export interface Collection extends BaseObject {
    collectionElementName: string;
}

export type CollectionElement<T extends BaseObject = BaseObject> = WithId<T>;

export interface CollectionRequestParams extends Collection {
    _id?: ObjectId;
    element?: CollectionElement;
    sortKey?: string;
    [key: string]: unknown;
}

export interface CollectionPostRequestParams extends Collection {
    _id: ObjectId;
    element: CollectionElement;
    [key: string]: unknown;
}
