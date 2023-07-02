import { getExistsError } from '@/utils/validation/errorMessages';
import {
    deleteCollectionSchema,
    getCollectionSchema,
    postCollectionSchema,
    putCollectionSchema,
} from '@/utils/validation/schemas/collectionBase';
import createHandler from '@/backend/createHandler';
import { checkIsElementExists } from '@/db/helpers';
import { collectionConnect } from '@/db';
import { BaseObject, CollectionPostRequestParams, CollectionRequestParams } from '@/types/apiModels';
import { ObjectId } from 'mongodb';
import { AVAILABLE_COLLECTIONS } from '@/constants/collections';

export const GET = createHandler(async (params: CollectionRequestParams) => {
    const { _id, collectionElementName, ...rest } = params;

    const collection = await collectionConnect(collectionElementName);

    if (_id) {
        const result = await collection.find({ _id: new ObjectId(_id) }).toArray();

        return result;
    }

    const result = await collection.find({ ...rest }).toArray();

    const sortKey =
        params.sortKey || AVAILABLE_COLLECTIONS.find((c) => c.name === collectionElementName)?.defaultSortKey;

    if (result && result.length && sortKey && typeof sortKey === 'string') {
        const sorted = result.sort((a, b) => {
            if (a[sortKey] < b[sortKey]) {
                return -1;
            }

            if (a[sortKey] > b[sortKey]) {
                return 1;
            }

            return 0;
        });

        return sorted;
    }

    return result || [];
}, getCollectionSchema);

export const POST = createHandler(async (params: CollectionPostRequestParams) => {
    const { collectionElementName, element } = params;

    const { _id, ...rest } = element;

    const collection = await collectionConnect(collectionElementName);

    await collection.updateOne(
        {
            _id: new ObjectId(_id),
        },
        {
            $set: { ...rest },
        }
    );

    return;
}, postCollectionSchema);

export const PUT = createHandler(async (params: CollectionPostRequestParams) => {
    const { collectionElementName, element } = params;

    const collection = await collectionConnect(collectionElementName);

    const { name } = element;
    const uniqueFields: BaseObject = { name };

    const requiredUniqueFields = AVAILABLE_COLLECTIONS.find((c) => c.name === collectionElementName)?.uniqueFields;

    if (Array.isArray(requiredUniqueFields) && requiredUniqueFields.length) {
        requiredUniqueFields.forEach((field) => {
            const value = element[field];

            uniqueFields[field] = value;
        });
    }

    const isElementExists = await checkIsElementExists(collection, { ...uniqueFields });

    if (isElementExists) {
        const uniqueFieldNames = Object.keys(uniqueFields);

        const errorText = getExistsError(collectionElementName, uniqueFieldNames);

        throw new Error(errorText);
    }

    await collection.insertOne(element || {});

    return;
}, putCollectionSchema);

export const DELETE = createHandler(async (params: CollectionRequestParams) => {
    const { collectionElementName, _id } = params;

    const collection = await collectionConnect(collectionElementName);

    await collection.deleteOne({
        _id: new ObjectId(_id),
    });

    return;
}, deleteCollectionSchema);
