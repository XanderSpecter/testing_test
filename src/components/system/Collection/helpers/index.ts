import { BaseObject, CollectionElement, PossibleFieldType } from '@/types/apiModels';
import { AvailableCollection, FieldParams } from '@/types/collections';
import { getDefaultValueByType } from '@/utils/collections';

export const isTypeEditableInForm = (type: PossibleFieldType) =>
    type === PossibleFieldType.STRING || type === PossibleFieldType.NUMBER || type === PossibleFieldType.BOOLEAN;

export const isFieldHiddenInTable = (field: FieldParams) => {
    if (!field) {
        return true;
    }

    const { title, hiddenInTable, type } = field;

    return Boolean(!title || hiddenInTable || type === PossibleFieldType.HIDDEN);
};

export const createEmptyElement = (fieldsMapping: AvailableCollection['fieldsMapping']) => {
    if (!fieldsMapping) {
        return null;
    }

    const emptyElement: BaseObject = {};

    Object.keys(fieldsMapping).forEach((key) => {
        const fieldParams = fieldsMapping[key];

        const { type } = fieldParams;

        if (isTypeEditableInForm(type)) {
            emptyElement[key] = getDefaultValueByType(type);
        }

        if (type === PossibleFieldType.EDITOR) {
            emptyElement[key] = [];
        }
    });

    return emptyElement as CollectionElement;
};
