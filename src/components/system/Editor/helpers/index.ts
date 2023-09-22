import { ElementType, GridContainer, StyledBlock, TextBlock } from '@/types/HTMLElements';
import { v4 as uuid } from 'uuid';
import { CollectionElement } from '@/types/apiModels';
import { ObjectId } from 'mongodb';
import { getObjectFromLocalStorage, saveObjectToLocalStorage } from '@/utils/localStorage';

export const saveLocalStorageCache = (id: ObjectId | string, data: CollectionElement | null) => {
    if (!id || !data) {
        return;
    }

    const dataToSet: CollectionElement = { ...data, lastUpdate: new Date().getTime() };

    saveObjectToLocalStorage(String(id), dataToSet);
};

export const getLocalStorageCache = (id: ObjectId | string) => {
    return getObjectFromLocalStorage<CollectionElement>(String(id));
};

export const createEmptyPageBlock = (type: ElementType, path?: string | null) => {
    if (!type) {
        return null;
    }

    switch (type) {
        case ElementType.CONTAINER:
            return {
                type: ElementType.CONTAINER,
                path: path ? `${path}.${uuid()}` : uuid(),
                tag: 'div',
            } as GridContainer;
        case ElementType.HTMLELEMENT:
            return {
                type: ElementType.HTMLELEMENT,
                path: path ? `${path}.${uuid()}` : uuid(),
                tag: 'div',
            } as StyledBlock;
        default:
            return {
                type: ElementType.TEXT,
                path: path ? `${path}.${uuid()}` : uuid(),
                value: '',
            } as TextBlock;
    }
};

export const recalcPath = (path: string) => path.split('.').join('.content.');
