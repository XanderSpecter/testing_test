import { AVAILABLE_COLLECTIONS } from '@/constants/collections';

export const camelToKebabCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const getMappedFieldParams = (collectionElementName: string, fieldName: string) => {
    if (!collectionElementName || !fieldName) {
        return null;
    }

    const collectionParams = AVAILABLE_COLLECTIONS.find((c) => c.name === collectionElementName);

    if (!collectionParams) {
        return null;
    }

    const { fieldsMapping } = collectionParams;

    if (!fieldsMapping) {
        return null;
    }

    const fieldParams = fieldsMapping[fieldName];

    return fieldParams || null;
};
