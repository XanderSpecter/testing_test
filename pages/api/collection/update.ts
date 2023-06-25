import type { NextApiRequest, NextApiResponse } from 'next';
import { withMethodChecking } from '../../../src/helpers/backendApiHelpers/withMethodChecking';
import { connect } from '../../../src/db';
import { getBaseRequestParamsIfCorrect } from '../../../src/helpers/backendApiHelpers/getBaseRequestParamsIfCorrect';
import { ObjectId } from 'mongodb';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { data, collectionName } = getBaseRequestParamsIfCorrect(req, true);

        const { body, _id } = data;

        if (!_id) {
            throw new Error(`Ты ебанушка? Как блять обновить элемент без id?`);
        }

        const db = await connect();
        const collection = db.collection(collectionName);

        await collection.updateOne(
            {
                _id: new ObjectId(_id),
            },
            {
                $set: { ...body },
            }
        );

        res.status(200).end();
    } catch (e) {
        res.status(500).json({ message: (e as Error).message });
    }
}

export default withMethodChecking(handler, 'POST');
