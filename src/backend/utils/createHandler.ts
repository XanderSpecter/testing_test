import { NextRequest, NextResponse } from 'next/server';
import validateRequestParams, { ValidateRequestSchema } from './validateRequestParams';
import parseRequest from './parseRequest';
import { BaseObject } from '@/types/apiModels';

/**
 * Инкапсулирует логику обработки `Request` и возврата `Response`, а также обработку ошибок и валидацию параметров.
 * @param handle Обработчик данных запроса - на вход принимает `params` - провалидированные параметры из `query` и/или `body` запроса. Внутри можно сделать логику или обращения к БД. Должен вернуть данные или хотя бы не сломаться для достижения успеха.
 * @param requestValidationSchema Схема валидации запроса, можно указать валидацию метода, а также схемы для всех параметров из `query` и/или `body`
 * @returns `Response` с результатом выполнения из хендлера или с ошибкой, если что-то пошло не так.
 */
const createHandler =
    <Params extends BaseObject = BaseObject, Response = unknown>(
        handler: (params: Params) => Promise<Response>,
        requestValidationSchema: ValidateRequestSchema
    ) =>
    async (req: NextRequest) => {
        try {
            const { params, method } = await parseRequest<Params>(req);

            validateRequestParams({ ...params, method }, requestValidationSchema);

            const result = await handler(params);

            const response = new NextResponse<Response>(JSON.stringify(result), {
                status: 200,
            });

            return response;
        } catch (e) {
            const response = new NextResponse(JSON.stringify({ message: (e as Error)?.message }), {
                status: 500,
            });

            return response;
        }
    };

export default createHandler;
