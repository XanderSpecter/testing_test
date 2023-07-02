import { ValidationSchema } from '@/utils/validation/validateSchema';
import { getRequiredParamError, getWrongMethodError } from '../errorMessages';
import isFieldValid from '../isFieldValid';
import { checkIsCollectionAvailable } from '@/utils/collections';

export const getCollectionSchema: ValidationSchema = {
    method: (v) => (v === 'GET' ? null : getWrongMethodError(v, 'GET')),
    collectionElementName: (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
};

export const putCollectionSchema: ValidationSchema = {
    'method': (v) => (v === 'PUT' ? null : getWrongMethodError(v, 'PUT')),
    'collectionElementName': (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
    'element': (v) => (isFieldValid(v, 'object') ? null : getRequiredParamError('element')),
    'element.name': (v) => (isFieldValid(v, 'string') ? null : getRequiredParamError('element.name')),
};

export const postCollectionSchema: ValidationSchema = {
    'method': (v) => (v === 'POST' ? null : getWrongMethodError(v, 'POST')),
    'collectionElementName': (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
    'element': (v) => (isFieldValid(v, 'object') ? null : getRequiredParamError('element')),
    'element._id': (v) => (isFieldValid(v, 'string') ? null : getRequiredParamError('element._id')),
    'element.name': (v) => (isFieldValid(v, 'string') ? null : getRequiredParamError('element.name')),
};

export const deleteCollectionSchema: ValidationSchema = {
    method: (v) => (v === 'DELETE' ? null : getWrongMethodError(v, 'DELETE')),
    collectionElementName: (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
    _id: (v) => (isFieldValid(v, 'string') ? null : getRequiredParamError('_id')),
};
