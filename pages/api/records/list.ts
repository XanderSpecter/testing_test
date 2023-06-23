import { WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withMethodAndErrorChecking } from '../../../src/helpers/backendApiHelpers';
import { connect } from '../../../src/db';
import { RECORDS_COLLECTION } from '../constants/records';

type Response = WithId<Record<string, string>>[];

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    const db = await connect();
    const collection = db.collection(RECORDS_COLLECTION);

    const allPages = await collection.find({}).toArray();

    res.status(200).json(allPages);
}

export default withMethodAndErrorChecking(handler, 'GET');
