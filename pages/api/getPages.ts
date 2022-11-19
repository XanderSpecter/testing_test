import { WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../db';
import { GET_ONLY_ERROR } from './constants';
import { ApiError } from './types';

type Response = WithId<Record<string, string>>[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response | ApiError>) {
    try {
        if (req.method === 'GET') {
            const dbconnection = await connect();

            const allPages = await dbconnection.find({}).toArray();

            res.status(200).json(allPages);
        } else {
            throw new Error(GET_ONLY_ERROR);
        }
    } catch (e) {
        res.status(500).json({ message: (e as Error).message });
    }
}
