import { NextRequest, NextResponse } from 'next/server';
import validateRequestParams from './validateRequestParams';
import parseRequest from './parseRequest';
import { BaseObject } from '@/types/apiModels';
import { ValidationSchema } from '@/utils/validation/validateSchema';
import { STRANGE_ERROR } from '@/utils/validation/errorMessages';
import { getValidationSchema } from '@/utils/collections';

/**
 * Инкапсулирует логику обработки `Request` и возврата `Response`, а также обработку ошибок и валидацию параметров.
 * @param handle Обработчик данных запроса - на вход принимает `params` - провалидированные параметры из `query` и/или `body` запроса. Внутри можно сделать логику или обращения к БД. Должен вернуть данные или хотя бы не сломаться для достижения успеха.
 * @param requestValidationSchema Схема валидации запроса, можно указать валидацию метода, а также схемы для всех параметров из `query` и/или `body`
 * @returns `Response` с результатом выполнения из хендлера или с ошибкой, если что-то пошло не так.
 */
const createHandler =
    <Params extends BaseObject = BaseObject, ResponseData = unknown>(
        handler: (params: Params) => Promise<ResponseData>,
        requestValidationSchema: ValidationSchema
    ) =>
    async (req: NextRequest) => {
        try {
            const { params, method } = await parseRequest<Params>(req);

            const { collectionElementName } = params;

            const extraSchema = getValidationSchema(collectionElementName, method);

            validateRequestParams(
                { ...params, method },
                extraSchema ? { ...requestValidationSchema, ...extraSchema } : requestValidationSchema
            );

            const result = await handler(params);

            return NextResponse.json(result || null, {
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
