import { NextRequest, NextResponse } from 'next/server';
import validateRequestParams from './validateRequestParams';
import parseRequest from './parseRequest';
import { BaseObject } from '@/types/apiModels';
import { ValidateSchema } from '@/utils/validation/validateSchema';
import { AVAILABLE_COLLECTIONS } from '@/constants/collections';
import { STRANGE_ERROR } from '@/utils/validation/errorMessages';

/**
 * Инкапсулирует логику обработки `Request` и возврата `Response`, а также обработку ошибок и валидацию параметров.
 * @param handle Обработчик данных запроса - на вход принимает `params` - провалидированные параметры из `query` и/или `body` запроса. Внутри можно сделать логику или обращения к БД. Должен вернуть данные или хотя бы не сломаться для достижения успеха.
 * @param requestValidationSchema Схема валидации запроса, можно указать валидацию метода, а также схемы для всех параметров из `query` и/или `body`
 * @returns `Response` с результатом выполнения из хендлера или с ошибкой, если что-то пошло не так.
 */
const createHandler =
    <Params extends BaseObject = BaseObject, ResponseData = unknown>(
        handler: (params: Params) => Promise<ResponseData>,
        requestValidationSchema: ValidateSchema
    ) =>
    async (req: NextRequest) => {
        try {
            const { params, method } = await parseRequest<Params>(req);

            const { collectionElementName } = params;

            const extraSchemas = AVAILABLE_COLLECTIONS.find((c) => c.name === collectionElementName)?.schemas;

            validateRequestParams(
                { ...params, method },
                extraSchemas && extraSchemas[method]
                    ? { ...requestValidationSchema, ...extraSchemas[method] }
                    : requestValidationSchema
            );

            const result = await handler(params);

            return NextResponse.json(result, {
                status: 200,
                statusText: 'GOOD BOY!',
            });
        } catch (e) {
            let message = '';
            let status = 500;
            let statusText = 'OH, SHIT, IM SORRY';

            if ((e as Error)?.message && (e as Error)?.message !== STRANGE_ERROR) {
                message = (e as Error).message;
                status = 400;
                statusText = 'FUCK YOU!';
            }

            return NextResponse.json(
                { message },
                {
                    status,
                    statusText,
                }
            );
        }
    };

export default createHandler;
