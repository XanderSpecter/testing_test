import { PossibleFieldType } from '@/types/apiModels';

const isFieldValid = (field: unknown, type?: PossibleFieldType) => {
    if (!field) {
        return false;
    }

    switch (type) {
        case 'string':
            return typeof field === 'string';
        case 'number':
            return typeof field === 'number' && !Number.isNaN(field);
        case 'boolean':
            return typeof field === 'boolean';
        case 'object':
            return typeof field === 'object';
        case 'array':
            return Array.isArray(field);
        default:
            return true;
    }
};

export default isFieldValid;
