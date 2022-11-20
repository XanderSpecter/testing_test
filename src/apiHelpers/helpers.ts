import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type AllowedMethod = 'POST' | 'GET';

export const withMethodAndErrorChecking =
    (allowedMethod: AllowedMethod) => async (req: NextApiRequest, res: NextApiResponse) => {
        return async function (handler: NextApiHandler) {
            try {
                if (!req.method) {
                    throw new Error(
                        `Тебя еблана не учили штоле указывать метод в запросе? Сюда нужен ${allowedMethod}`
                    );
                }

                if (req.method.toUpperCase() !== allowedMethod) {
                    throw new Error(
                        `Какого блять хуя ты юзаешь ${req.method}, когда надо ${allowedMethod}. Иди нахуй, долбоёб`
                    );
                }

                return handler(req, res);
            } catch (e) {
                res.status(500).json({ message: (e as Error).message });
            }
        };
    };

type Middleware = (req: NextApiRequest, res: NextApiResponse) => unknown;
type Maybe<T> = T | null;

export function withMiddleware(...middlewares: Middleware[]) {
    return async function withMiddlewareHandler(req: NextApiRequest, res: NextApiResponse) {
        async function evaluateHandler(middleware: Middleware, innerMiddleware?: Maybe<Middleware>) {
            if (res.headersSent) {
                return;
            }

            if (typeof middleware === 'function') {
                const handler = await middleware(req, res);

                if (typeof handler === 'function') {
                    if (innerMiddleware) {
                        await handler(innerMiddleware);

                        const index = middlewares.indexOf(innerMiddleware);

                        if (index >= 0) {
                            middlewares.splice(index, 1);
                        }
                    } else {
                        await handler();
                    }
                }
            }
        }

        for (let index = 0; index < middlewares.length; index++) {
            const middleware = middlewares[index];
            const nextMiddleware = middlewares[index + 1];

            await evaluateHandler(middleware, nextMiddleware);
        }
    };
}
