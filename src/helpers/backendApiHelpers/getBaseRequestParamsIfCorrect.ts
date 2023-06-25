import { NextApiRequest } from 'next';
import { CollectionElement, CollectionRequestParams } from '../../types/apiModels';

type RequestDataCheckResult<T extends boolean> = T extends true ? CollectionElement : null;

export const getBaseRequestParamsIfCorrect = <T extends boolean>(req: NextApiRequest, isBodyNeeded?: T) => {
    const { collectionElementName: queryCollectionElementName, ...query } = req.query;
    const { element, collectionElementName: bodyCollectionElementName, ...body } = req.body as CollectionRequestParams;

    if (!queryCollectionElementName && !bodyCollectionElementName) {
        throw new Error(`Ну и в какую коллекцию, по твоему, надо обращаться? Указывать то кто будет? Еблан нахуй`);
    }

    if (!element && isBodyNeeded) {
        throw new Error(`Ты бля дебил штоле? А тело запроса кто будет отправлять?`);
    }

    return {
        element: isBodyNeeded ? (element as RequestDataCheckResult<T>) : (null as RequestDataCheckResult<T>),
        collectionElementName: bodyCollectionElementName || queryCollectionElementName?.toString() || 'default',
        ...query,
        ...body,
    };
};
