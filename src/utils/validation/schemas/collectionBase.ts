import { ValidateSchema } from '@/utils/validation/validateSchema';
import { getRequiredParamError, getWrongMethodError } from '../errorMessages';
import checkIsCollectionAvailable from '@/backend/checkIsCollectionAvailable';
import isFieldValid from '../isFieldValid';

export const getCollectionSchema: ValidateSchema = {
    method: (v) => (v === 'GET' ? null : getWrongMethodError(v, 'GET')),
    collectionElementName: (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
};

export const putCollectionSchema: ValidateSchema = {
    'method': (v) => (v === 'PUT' ? null : getWrongMethodError(v, 'PUT')),
    'collectionElementName': (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
    'element': (v) => (isFieldValid(v, 'object') ? null : getRequiredParamError('element')),
    'element.name': (v) => (isFieldValid(v, 'string') ? null : getRequiredParamError('element.name')),
};

export const postCollectionSchema: ValidateSchema = {
    'method': (v) => (v === 'POST' ? null : getWrongMethodError(v, 'POST')),
    'collectionElementName': (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
    'element': (v) => (isFieldValid(v, 'object') ? null : getRequiredParamError('element')),
    'element._id': (v) => (isFieldValid(v, 'string') ? null : getRequiredParamError('element._id')),
    'element.name': (v) => (isFieldValid(v, 'string') ? null : getRequiredParamError('element.name')),
};

export const deleteCollectionSchema: ValidateSchema = {
    method: (v) => (v === 'DELETE' ? null : getWrongMethodError(v, 'DELETE')),
    collectionElementName: (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
    _id: (v) => (isFieldValid(v, 'string') ? null : getRequiredParamError('_id')),
};
