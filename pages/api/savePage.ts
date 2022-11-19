import type { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../db';
import { POST_ONLY_ERROR, POST_SUCCESS } from './constants';
import { ApiError } from './types';

interface SavePageData {
    pageName: string;
    pageData: Record<string, string>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiError>) {
    try {
        if (req.method === 'POST') {
            const { pageName, pageData } = req.body as SavePageData;
            const dbconnection = await connect();

            await dbconnection.insertOne({ [pageName]: JSON.stringify(pageData) });

            res.status(200).json({ message: POST_SUCCESS });
        } else {
            throw new Error(POST_ONLY_ERROR);
        }
    } catch (e) {
        res.status(500).json({ message: (e as Error).message });
    }
}
