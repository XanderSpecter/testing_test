import type { NextApiRequest, NextApiResponse } from 'next';
import { withMethodChecking } from '../../../src/helpers/backendApiHelpers/withMethodChecking';
import { connect } from '../../../src/db';
import { getBaseRequestParamsIfCorrect } from '../../../src/helpers/backendApiHelpers/getBaseRequestParamsIfCorrect';
import { ObjectId } from 'mongodb';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { collectionElementName, _id, data, ...rest } = getBaseRequestParamsIfCorrect(req);

        const db = await connect();
        const collection = db.collection(collectionElementName);

        if (_id) {
            const result = await collection.find({ _id: new ObjectId(_id) }).toArray();

            res.status(200).json(result);

            return;
        }

        const result = await collection.find({ ...rest }).toArray();

        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: (e as Error).message });
    }
}

export default withMethodChecking(handler, 'GET');
