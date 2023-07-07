import { ElementType, StyledBlock, StyledText } from '@/types/HTMLElements';
import { v4 as uuid } from 'uuid';
import { CollectionElement } from '@/types/apiModels';
import { ObjectId } from 'mongodb';

interface RecalcWidthAndMarginsParams {
    width?: string | number;
    marginLeft?: string | number;
    screenWidth: number;
}

export const recalcWidthAndMargins = ({ width, marginLeft, screenWidth }: RecalcWidthAndMarginsParams) => {
    let calculatedWidth = 0;

    if (typeof width === 'number') {
        calculatedWidth = width;
    }

    if (typeof width === 'string' && width.includes('%')) {
        const widthPercent = parseInt(width);

        calculatedWidth = Math.round(screenWidth / widthPercent);
    }

    const calculatedMarginLeft =
        typeof marginLeft === 'number' ? marginLeft : Math.round((screenWidth - calculatedWidth) / 2);

    const calculatedMarginRight = screenWidth - (calculatedMarginLeft + calculatedWidth);

    return {
        calculatedWidth,
        calculatedMarginLeft,
        calculatedMarginRight,
    };
};

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

export const createEmptyPageBlock = (type: ElementType) => {
    if (!type) {
        return null;
    }

    switch (type) {
        case ElementType.HTMLELEMENT:
            return {
                type: ElementType.HTMLELEMENT,
                editorId: uuid(),
                tag: 'div',
                stylesByBreakpoint: {
                    all: {
                        height: 50,
                        backgroundColor: 'red',
                    },
                },
            } as StyledBlock;
        default:
            return {
                type: ElementType.TEXT,
                editorId: uuid(),
                value: '',
            } as StyledText;
    }
};
