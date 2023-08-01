import { AnyArray, BaseObject } from '@/types/apiModels';

export const savePlainDataToLocalStorage = (key: string, data: string | number | boolean) => {
    if (!key || !data) {
        return;
    }

    localStorage.setItem(key, String(data));
};

export const getPlainDataFromLocalStorage = (key: string) => {
    if (!key) {
        return null;
    }

    const data = localStorage.getItem(key);

    return data;
};

export const saveObjectToLocalStorage = <T extends BaseObject | AnyArray>(key: string, data: T) => {
    if (!key || !data) {
        return;
    }

    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        return;
    }
};

export const getObjectFromLocalStorage = <T extends BaseObject | AnyArray>(key: string) => {
    if (!key) {
        return null;
    }

    try {
        const dataString = getPlainDataFromLocalStorage(key);

        if (!dataString) {
            return null;
        }

        const data: T = JSON.parse(dataString);

        return data;
    } catch (e) {
        return null;
    }
};

export const deleteFromLocalStorage = (key: string) => {
    if (!key) {
        return;
    }

    localStorage.removeItem(key);
};
