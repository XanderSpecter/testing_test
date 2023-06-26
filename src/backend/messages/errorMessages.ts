import { PossibleMethod } from '@/types/apiModels';

export const getWrongMethodError = (currentMethod: unknown, allowedMethod: PossibleMethod) =>
    `Какого блять хуя ты юзаешь ${currentMethod}, когда надо ${allowedMethod}. Иди нахуй, долбоёб`;

export const COLLECTION_NAME_ERROR =
    'Ну и в какую коллекцию, по твоему, надо обращаться? Указывать то кто будет? Еблан нахуй';

export const UPDATE_ID_ERROR = 'Ты ебанушка? Как блять обновить элемент без id?';
export const UPDATE_DATA_ERROR = 'А хуль ты ничего не постишь то, дебил? Нечего штоле?';
export const DELETE_ID_ERROR = 'Каво удалить то? Еблан блять. id кто указывать будет?';
