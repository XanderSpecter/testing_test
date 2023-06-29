import { PossibleMethod } from '@/types/apiModels';
import { getMappedFieldParams } from '../textHelpers';

export const STRANGE_ERROR = 'Какая-то непонятная фигня происходит, сорян ¯|_(ツ)_|¯';

export const getWrongMethodError = (currentMethod: unknown, allowedMethod: PossibleMethod) =>
    `Какого блять хуя ты юзаешь ${currentMethod}, когда надо ${allowedMethod}. Иди нахуй`;

export const getRequiredParamError = (paramName: string, collectionElementName?: string) => {
    let fieldParams = null;

    if (collectionElementName) {
        fieldParams = getMappedFieldParams(collectionElementName, paramName);
    }

    return `Поле '${fieldParams?.title || paramName}' не указано или заполнено некорректно.${
        fieldParams?.description ? ` ${fieldParams?.description}` : ''
    }`;
};

export const getExistsError = (collectionElementName: string, uniqueFieldNames: string[]) => {
    if (!collectionElementName || !uniqueFieldNames || !uniqueFieldNames.length) {
        return STRANGE_ERROR;
    }

    let errorText = '';

    uniqueFieldNames.forEach((field, index) => {
        const fieldParams = getMappedFieldParams(collectionElementName, field);

        errorText += `Поле '${fieldParams?.title || field}' должно быть уникальным`;

        if (index < uniqueFieldNames.length - 1) {
            errorText += ', ';
        }
    });

    return errorText;
};
