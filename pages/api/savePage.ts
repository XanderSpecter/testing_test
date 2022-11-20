import type { NextApiRequest, NextApiResponse } from 'next';
import { withMethodAndErrorChecking, withMiddleware } from '../../src/helpers/backendApiHelpers';
import { connect } from '../../src/db';

interface SavePageData {
    pageName: string;
    pageData: Record<string, string>;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { pageName, pageData } = req.body as SavePageData;
    const dbconnection = await connect();

    await dbconnection.insertOne({ [pageName]: pageData });

    res.status(200).end();
}

export default withMiddleware(withMethodAndErrorChecking('POST'), handler);
