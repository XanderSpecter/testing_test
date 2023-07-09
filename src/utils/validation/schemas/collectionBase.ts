import { PossibleFieldType, PossibleMethod } from '@/types/apiModels';
import { ValidationSchema } from '@/utils/validation/validateSchema';
import { getRequiredParamError, getWrongMethodError } from '../errorMessages';
import isFieldValid from '../isFieldValid';
import { checkIsCollectionAvailable } from '@/utils/collections';

export const getCollectionSchema: ValidationSchema = {
    method: (v) => (v === PossibleMethod.GET ? null : getWrongMethodError(v, PossibleMethod.GET)),
    collectionElementName: (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
};

export const putCollectionSchema: ValidationSchema = {
    'method': (v) => (v === PossibleMethod.PUT ? null : getWrongMethodError(v, PossibleMethod.PUT)),
    'collectionElementName': (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
    'element.name': (v) => (isFieldValid(v, PossibleFieldType.STRING) ? null : getRequiredParamError('element.name')),
};

export const postCollectionSchema: ValidationSchema = {
    'method': (v) => (v === PossibleMethod.POST ? null : getWrongMethodError(v, PossibleMethod.POST)),
    'collectionElementName': (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
    'element._id': (v) => (isFieldValid(v, PossibleFieldType.STRING) ? null : getRequiredParamError('element._id')),
    'element.name': (v) => (isFieldValid(v, PossibleFieldType.STRING) ? null : getRequiredParamError('element.name')),
};

export const deleteCollectionSchema: ValidationSchema = {
    method: (v) => (v === PossibleMethod.DELETE ? null : getWrongMethodError(v, PossibleMethod.DELETE)),
    collectionElementName: (v) =>
        checkIsCollectionAvailable(v) ? null : getRequiredParamError('collectionElementName'),
    _id: (v) => (isFieldValid(v, PossibleFieldType.STRING) ? null : getRequiredParamError('_id')),
};
