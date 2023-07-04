import { BaseObject, FieldsErrors } from '@/types/apiModels';
import { getMappedFieldParams } from '@/utils/collections';
import { Collection, ObjectId } from 'mongodb';

interface ExistedElements {
    fieldName: string;
    elements?: unknown;
}

export const getExistedFieldsErrors = async <T extends Collection>(
    collection: T,
    collectionElementName: string,
    fields?: BaseObject,
    _id?: ObjectId
) => {
    if (!fields) {
        return null;
    }

    if (Object.keys(fields).length === 0) {
        return null;
    }

    const allResultsArray = await Promise.all(
        Object.keys(fields).map(async (key) => {
            const check = { [key]: fields[key] };

            const result = await collection.find({ ...check }).toArray();

            const existed: ExistedElements = {
                fieldName: key,
            };

            if (Array.isArray(result) && result.length) {
                if (_id) {
                    const filtered = result.filter((e) => String(e._id) !== String(_id));

                    existed.elements = filtered.length ? filtered : null;

                    return existed;
                }

                existed.elements = result;

                return existed;
            }

            existed.elements = null;

            return existed;
        })
    );

    const allMatches = allResultsArray.filter((e) => Array.isArray(e.elements) && e.elements.length > 0);

    if (!allMatches || !allMatches.length) {
        return null;
    }

    const errors: FieldsErrors = {};

    allMatches.forEach((field) => {
        const { fieldName } = field;

        const fieldParams = getMappedFieldParams(collectionElementName, fieldName);

        errors[fieldName] = `Поле '${fieldParams?.title || field}' должно быть уникальным`;
    });

    return errors;
};
