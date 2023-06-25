import type { NextApiRequest, NextApiResponse } from 'next';
import { withMethodChecking } from '../../../src/helpers/backendApiHelpers/withMethodChecking';
import { connect } from '../../../src/db';
import { getBaseRequestParamsIfCorrect } from '../../../src/helpers/backendApiHelpers/getBaseRequestParamsIfCorrect';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { element, collectionElementName } = getBaseRequestParamsIfCorrect(req);

        const db = await connect();
        const collection = db.collection(collectionElementName);

        await collection.insertOne(element || {});

        res.status(200).end();
    } catch (e) {
        res.status(500).json({ message: (e as Error).message });
    }
}

export default withMethodChecking(handler, 'PUT');
