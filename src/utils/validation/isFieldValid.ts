import { PossibleFieldType } from '@/types/apiModels';

const isFieldValid = (field: unknown, type?: PossibleFieldType) => {
    if (!field) {
        return false;
    }

    switch (type) {
        case PossibleFieldType.STRING:
            return typeof field === 'string';
        case PossibleFieldType.NUMBER:
            return typeof field === 'number' && !Number.isNaN(field);
        case PossibleFieldType.BOOLEAN:
            return typeof field === 'boolean';
        case PossibleFieldType.EDITOR:
            return typeof field === 'object';
        default:
            return true;
    }
};

export default isFieldValid;
