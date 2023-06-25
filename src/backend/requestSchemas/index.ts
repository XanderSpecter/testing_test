import {
    COLLECTION_NAME_ERROR,
    DELETE_ID_ERROR,
    UPDATE_DATA_ERROR,
    UPDATE_ID_ERROR,
    getWrongMethodError,
} from '../messages/errorMessages';
import { ValidateRequestSchema } from '../utils/validateRequestParams';

export const getCollectionSchema: ValidateRequestSchema = {
    method: (v) => (v === 'GET' ? null : getWrongMethodError(v, 'GET')),
    collectionElementName: (v) => (!!v ? null : COLLECTION_NAME_ERROR),
};

export const putCollectionSchema: ValidateRequestSchema = {
    method: (v) => (v === 'PUT' ? null : getWrongMethodError(v, 'PUT')),
    collectionElementName: (v) => (!!v ? null : COLLECTION_NAME_ERROR),
};

export const postCollectionSchema: ValidateRequestSchema = {
    'method': (v) => (v === 'POST' ? null : getWrongMethodError(v, 'POST')),
    'collectionElementName': (v) => (!!v ? null : COLLECTION_NAME_ERROR),
    'element': (v) => (!!v ? null : UPDATE_DATA_ERROR),
    'element._id': (v) => (!!v ? null : UPDATE_ID_ERROR),
};

export const deleteCollectionSchema: ValidateRequestSchema = {
    method: (v) => (v === 'DELETE' ? null : getWrongMethodError(v, 'DELETE')),
    collectionElementName: (v) => (!!v ? null : COLLECTION_NAME_ERROR),
    _id: (v) => (!!v ? null : DELETE_ID_ERROR),
};
