import type { NextApiRequest, NextApiResponse } from 'next';
import { withMethodChecking } from '../../../src/helpers/backendApiHelpers/withMethodChecking';
import { connect } from '../../../src/db';
import { getBaseRequestParamsIfCorrect } from '../../../src/helpers/backendApiHelpers/getBaseRequestParamsIfCorrect';
import { ObjectId } from 'mongodb';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { _id, collectionElementName } = getBaseRequestParamsIfCorrect(req);

        if (!_id) {
            throw new Error(`Каво удалить то? Еблан блать. id кто указывать будет?`);
        }

        const db = await connect();
        const collection = db.collection(collectionElementName);

        await collection.deleteOne({
            _id: new ObjectId(_id),
        });

        res.status(200).end();
    } catch (e) {
        res.status(500).json({ message: (e as Error).message });
    }
}

export default withMethodChecking(handler, 'DELETE');
