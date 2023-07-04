import { BaseObject, PossibleMethod } from '@/types/apiModels';
import { NextRequest } from 'next/server';

const parseRequest = async <T extends BaseObject = BaseObject>(req: NextRequest) => {
    const { nextUrl, method } = req;

    const query: BaseObject = {};

    const { searchParams } = new URL(nextUrl);

    searchParams.forEach((value: string, key: string) => (query[key] = value));

    const body: BaseObject = method === 'PUT' || method === 'POST' ? await req.json() : {};

    const params = { ...query, ...body };

    return {
        params: params as T,
        method: method as PossibleMethod,
    };
};

export default parseRequest;
