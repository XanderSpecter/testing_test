import { BaseObject, CollectionElement, PossibleFieldType } from '@/types/apiModels';
import { AvailableCollection } from '@/types/collections';
import { getDefaultValueByType } from '@/utils/collections';

export const isTypeEditable = (type: PossibleFieldType) => type === 'string' || type === 'number' || type === 'boolean';

export const createEmptyElement = (fieldsMapping: AvailableCollection['fieldsMapping']) => {
    if (!fieldsMapping) {
        return null;
    }

    const emptyElement: BaseObject = {};

    Object.keys(fieldsMapping).forEach((key) => {
        const fieldParams = fieldsMapping[key];

        const { type, hidden } = fieldParams;

        if (!hidden && isTypeEditable(type)) {
            emptyElement[key] = getDefaultValueByType(type);
        }
    });

    return emptyElement as CollectionElement;
};
