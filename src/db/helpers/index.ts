import { BaseObject } from '@/types/apiModels';
import { Collection, ObjectId } from 'mongodb';

export const checkIsElementExists = async <T extends Collection>(
    collection: T,
    fields?: BaseObject,
    _id?: ObjectId
) => {
    if (!fields) {
        return false;
    }

    if (Object.keys(fields).length === 0) {
        return false;
    }

    const allResultsArray = await Promise.all(
        Object.keys(fields).map(async (key) => {
            const check = { [key]: fields[key] };

            const result = await collection.find({ ...check }).toArray();

            return result || [];
        })
    );

    const allResults = allResultsArray.reduce((acc, current) => {
        current.forEach((e) => acc.push(e));

        return acc;
    });

    if (_id) {
        const withoutEditedElement = allResults.filter((e) => String(e._id) !== String(_id));

        return withoutEditedElement && Array.isArray(withoutEditedElement) && withoutEditedElement.length > 0;
    }

    return allResults && Array.isArray(allResults) && allResults.length > 0;
};
