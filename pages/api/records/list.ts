import { WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withMethodAndErrorChecking, withMiddleware } from '../../../src/helpers/backendApiHelpers';
import { connect } from '../../../src/db';

type Response = WithId<Record<string, string>>[];

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    const dbconnection = await connect();

    const allPages = await dbconnection.find({}).toArray();

    res.status(200).json(allPages);
}

export default withMiddleware(withMethodAndErrorChecking('GET'), handler);
