import { BaseObject } from '@/types/apiModels';
import { Collection } from 'mongodb';

export const checkIsElementExists = async <T extends Collection>(collection: T, fields?: BaseObject) => {
    if (!fields) return false;

    if (Object.keys(fields).length === 0) return false;

    const result = await collection.find({ ...fields }).toArray();

    return result && Array.isArray(result) && result.length > 0;
};
