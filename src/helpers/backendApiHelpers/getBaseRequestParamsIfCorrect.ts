import { NextApiRequest } from 'next';
import { CollectionElementData, CollectionRequestParams } from '../../types/apiModels';

type RequestDataCheckResult<T extends boolean> = T extends true ? CollectionElementData : null;

export const getBaseRequestParamsIfCorrect = <T extends boolean>(req: NextApiRequest, isBodyNeeded?: T) => {
    const { collectionName: queryCollectionName, ...query } = req.query;
    const { data, collectionName: bodyCollectionName, ...body } = req.body as CollectionRequestParams;

    if (!queryCollectionName && !bodyCollectionName) {
        throw new Error(`Ну и в какую коллекцию, по твоему, надо обращаться? Указывать то кто будет? Еблан нахуй`);
    }

    if (!data && isBodyNeeded) {
        throw new Error(`Ты бля дебил штоле? А тело запроса кто будет отправлять?`);
    }

    return {
        data: isBodyNeeded ? (data as RequestDataCheckResult<T>) : (null as RequestDataCheckResult<T>),
        collectionName: bodyCollectionName || queryCollectionName?.toString() || 'default',
        ...query,
        ...body,
    };
};
