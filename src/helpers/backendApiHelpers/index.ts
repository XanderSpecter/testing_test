import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { AllowedMethod } from '../../types';

export const withMethodAndErrorChecking =
    (handler: NextApiHandler, allowedMethod: AllowedMethod) => (req: NextApiRequest, res: NextApiResponse) => {
        try {
            if (!req.method) {
                throw new Error(`Тебя еблана не учили штоле указывать метод в запросе? Сюда нужен ${allowedMethod}`);
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
