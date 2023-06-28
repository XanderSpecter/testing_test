import { PossibleMethod } from '@/types/apiModels';

export const getWrongMethodError = (currentMethod: unknown, allowedMethod: PossibleMethod) =>
    `Какого блять хуя ты юзаешь ${currentMethod}, когда надо ${allowedMethod}. Иди нахуй`;

export const getRequiredParamError = (paramName: string) =>
    `Если не указать валидный ${paramName}, нихуя у тебя не выйдет`;

export const EXISTS_ERROR = `Такое уже есть, не пытайся наебать`;
