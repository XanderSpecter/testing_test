import {
    deleteCollectionSchema,
    getCollectionSchema,
    postCollectionSchema,
    putCollectionSchema,
} from '@/backend/requestSchemas';
import createHandler from '@/backend/utils/createHandler';
import { connect } from '@/db';
import { CollectionPostRequestParams, CollectionRequestParams } from '@/types/apiModels';
import { ObjectId } from 'mongodb';

export const GET = createHandler(async (params: CollectionRequestParams) => {
    const { _id, collectionElementName, ...rest } = params;

    const db = await connect();
    const collection = db.collection(collectionElementName);

    if (_id) {
        const result = await collection.find({ _id: new ObjectId(_id) }).toArray();

        return result;
    }

    const result = await collection.find({ ...rest }).toArray();

    return result;
}, getCollectionSchema);

export const POST = createHandler(async (params: CollectionPostRequestParams) => {
    const { collectionElementName, element } = params;

    const { _id, ...rest } = element;

    const db = await connect();
    const collection = db.collection(collectionElementName);

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

    const db = await connect();
    const collection = db.collection(collectionElementName);

    await collection.insertOne(element || {});

    return;
}, putCollectionSchema);

export const DELETE = createHandler(async (params: CollectionRequestParams) => {
    const { collectionElementName, _id } = params;

    const db = await connect();
    const collection = db.collection(collectionElementName);

    await collection.deleteOne({
        _id: new ObjectId(_id),
    });

    return;
}, deleteCollectionSchema);
