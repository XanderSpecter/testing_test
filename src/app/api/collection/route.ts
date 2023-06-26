import {
    deleteCollectionSchema,
    getCollectionSchema,
    postCollectionSchema,
    putCollectionSchema,
} from '@/backend/requestSchemas/collection';
import createHandler from '@/backend/utils/createHandler';
import { collectionConnect } from '@/db';
import { CollectionPostRequestParams, CollectionRequestParams } from '@/types/apiModels';
import { ObjectId } from 'mongodb';

export const GET = createHandler(async (params: CollectionRequestParams) => {
    const { _id, collectionElementName, ...rest } = params;

    const collection = await collectionConnect(collectionElementName);

    if (_id) {
        const result = await collection.find({ _id: new ObjectId(_id) }).toArray();

        return result;
    }

    const result = await collection.find({ ...rest }).toArray();

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

export const PUT = createHandler(async (params: CollectionRequestParams) => {
    const { collectionElementName, element } = params;

    const collection = await collectionConnect(collectionElementName);

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
