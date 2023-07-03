import { PossibleMethod } from '@/types/apiModels';
import { getMappedFieldParams } from '../collections';

export const STRANGE_ERROR = 'Какая-то непонятная фигня происходит, сорян ¯|_(ツ)_|¯';

export const getWrongMethodError = (currentMethod: unknown, allowedMethod: PossibleMethod) =>
    `Какого блять хуя ты юзаешь ${currentMethod}, когда надо ${allowedMethod}. Иди нахуй`;

export const getRequiredParamError = (
    paramName: string,
    collectionElementName?: string | null,
    paramDescription?: string
) => {
    let fieldParams = null;

    let name = paramName;
    let description = paramDescription;

    if (collectionElementName) {
        fieldParams = getMappedFieldParams(collectionElementName, paramName);

        name = fieldParams?.title || paramName;
        description = fieldParams?.description || paramDescription;
    }

    return `Поле '${name}' не указано или заполнено некорректно.${description ? ` ${description}` : ''}`;
};
