import { AVAILABLE_COLLECTIONS } from '@/constants/collections';
import { PossibleFieldType, PossibleMethod } from '@/types/apiModels';
import { ValidationSchema } from '../validation/validateSchema';
import isFieldValid from '../validation/isFieldValid';
import { getRequiredParamError } from '../validation/errorMessages';

export const getCorrectCollections = () => {
    return AVAILABLE_COLLECTIONS.filter((c) => c.name && c.title && c.fieldsMapping && c.defaultSortKey);
};

export const checkIsCollectionAvailable = (collectionElementName?: unknown) => {
    if (!collectionElementName) {
        return false;
    }

    return AVAILABLE_COLLECTIONS.some((c) => c.name === collectionElementName);
};

export const getCollectionParams = (collectionElementName?: unknown) => {
    if (!collectionElementName) {
        return null;
    }

    return AVAILABLE_COLLECTIONS.find((c) => c.name === collectionElementName) || null;
};

export const getFieldsMapping = (collectionElementName?: unknown) => {
    if (!collectionElementName) {
        return null;
    }

    return getCollectionParams(collectionElementName)?.fieldsMapping || null;
};

export const getMappedFieldParams = (collectionElementName: string, fieldName: string) => {
    if (!collectionElementName || !fieldName) {
        return null;
    }

    const fieldsMapping = getFieldsMapping(collectionElementName);

    if (!fieldsMapping) {
        return null;
    }

    const fieldParams = fieldsMapping[fieldName];

    return fieldParams || null;
};

export const getRequredUniqeFields = (collectionElementName?: unknown) => {
    if (!collectionElementName) {
        return null;
    }

    const requiredUniqueFields: string[] = [];

    const fieldsMapping = getCollectionParams(collectionElementName)?.fieldsMapping || null;

    if (fieldsMapping) {
        Object.keys(fieldsMapping).forEach((key) => {
            if (fieldsMapping[key].mustBeUnique) {
                requiredUniqueFields.push(key);
            }
        });
    }

    return requiredUniqueFields.length ? requiredUniqueFields : null;
};

export const getValidationSchema = (collectionElementName?: unknown, method?: PossibleMethod) => {
    if (!collectionElementName || typeof collectionElementName !== 'string' || !method) {
        return null;
    }

    const extraSchema = getCollectionParams(collectionElementName)?.extraSchemas?.[method] || {};

    if (method === PossibleMethod.GET || method === PossibleMethod.DELETE) {
        return extraSchema;
    }

    const fieldsMapping = getCollectionParams(collectionElementName)?.fieldsMapping || null;

    const fieldsSchema: ValidationSchema = {};

    if (fieldsMapping) {
        Object.keys(fieldsMapping).forEach((key) => {
            const { required, type, title, description } = fieldsMapping[key];
            const path = `element.${key}`;
            let validator = (v: unknown) =>
                !v || isFieldValid(v, type) ? null : getRequiredParamError(title, null, description);

            if (required) {
                validator = (v: unknown) =>
                    isFieldValid(v, type) ? null : getRequiredParamError(title, null, description);
            }

            fieldsSchema[path] = validator;
        });
    }

    return { ...fieldsSchema, ...extraSchema };
};

export const getDefaultValueByType = (type?: PossibleFieldType) => {
    if (!type) {
        return false;
    }

    switch (type) {
        case PossibleFieldType.STRING:
            return '';
        case PossibleFieldType.NUMBER:
            return 0;
        case PossibleFieldType.BOOLEAN:
            return false;
        default:
            return null;
    }
};
