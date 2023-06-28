import { ValidateSchema } from '@/utils/validation/validateSchema';
import {
    COLLECTION_NAME_ERROR,
    DELETE_ID_ERROR,
    ELEMENT_DATA_ERROR,
    ELEMENT_NAME_ERROR,
    UPDATE_ID_ERROR,
    getWrongMethodError,
} from '../messages/errorMessages';

export const getCollectionSchema: ValidateSchema = {
    method: (v) => (v === 'GET' ? null : getWrongMethodError(v, 'GET')),
    collectionElementName: (v) => (!!v ? null : COLLECTION_NAME_ERROR),
};

export const putCollectionSchema: ValidateSchema = {
    'method': (v) => (v === 'PUT' ? null : getWrongMethodError(v, 'PUT')),
    'collectionElementName': (v) => (!!v ? null : COLLECTION_NAME_ERROR),
    'element': (v) => (!!v ? null : ELEMENT_DATA_ERROR),
    'element.name': (v) => (!!v ? null : ELEMENT_NAME_ERROR),
};

export const postCollectionSchema: ValidateSchema = {
    'method': (v) => (v === 'POST' ? null : getWrongMethodError(v, 'POST')),
    'collectionElementName': (v) => (!!v ? null : COLLECTION_NAME_ERROR),
    'element': (v) => (!!v ? null : ELEMENT_DATA_ERROR),
    'element._id': (v) => (!!v ? null : UPDATE_ID_ERROR),
    'element.name': (v) => (!!v ? null : ELEMENT_NAME_ERROR),
};

export const deleteCollectionSchema: ValidateSchema = {
    method: (v) => (v === 'DELETE' ? null : getWrongMethodError(v, 'DELETE')),
    collectionElementName: (v) => (!!v ? null : COLLECTION_NAME_ERROR),
    _id: (v) => (!!v ? null : DELETE_ID_ERROR),
};
