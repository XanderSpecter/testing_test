import type { NextApiRequest, NextApiResponse } from 'next';
import { withMethodAndErrorChecking } from '../../../src/helpers/backendApiHelpers';
import { connect } from '../../../src/db';
import { RECORDS_COLLECTION } from '../constants/records';

interface SavePageData {
    name: string;
    data: Record<string, string>;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name, data } = req.body as SavePageData;
    const db = await connect();
    const collection = db.collection(RECORDS_COLLECTION);

    await collection.insertOne({ [name]: data });

    res.status(200).end();
}

export default withMethodAndErrorChecking(handler, 'POST');
