import { PossibleMethod } from '@/types/apiModels';

export const getWrongMethodError = (currentMethod: unknown, allowedMethod: PossibleMethod) =>
    `Какого блять хуя ты юзаешь ${currentMethod}, когда надо ${allowedMethod}. Иди нахуй`;

export const COLLECTION_NAME_ERROR = 'Ну и в какую коллекцию, по твоему, надо обращаться? Указывать то кто будет?';

export const UPDATE_ID_ERROR = 'Как блять обновить элемент без id?';
export const ELEMENT_DATA_ERROR = 'А где блять элемент то?';
export const ELEMENT_NAME_ERROR = 'Имя то бля кто будет указывать? Оно обязательное! Ало блять!';
export const DELETE_ID_ERROR = 'Каво удалить то? id кто указывать будет?';
export const ELEMENT_EXIXTS_ERROR = 'Такой элемент уже существует! Кури блять мануалы!';
