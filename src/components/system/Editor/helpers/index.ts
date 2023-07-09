import { ElementType, StyledBlock, TextBlock } from '@/types/HTMLElements';
import { v4 as uuid } from 'uuid';
import { CollectionElement } from '@/types/apiModels';
import { ObjectId } from 'mongodb';

export const saveLocalStorageCache = (id: ObjectId | string, data: CollectionElement | null) => {
    if (!id || !data) {
        return;
    }

    const dataToSet: CollectionElement = { ...data, lastUpdate: new Date().getTime() };

    localStorage.setItem(String(id), JSON.stringify(dataToSet));
};

export const getLocalStorageCache = (id: ObjectId | string) => {
    if (!id) {
        return null;
    }

    try {
        const dataString = localStorage.getItem(String(id));

        if (!dataString) {
            return null;
        }

        const data: CollectionElement = JSON.parse(dataString);

        return data;
    } catch (e) {
        return null;
    }
};

export const createEmptyPageBlock = (type: ElementType, path?: string | null) => {
    if (!type) {
        return null;
    }

    switch (type) {
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
