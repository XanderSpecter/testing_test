import { BaseObject } from '@/types/apiModels';

/**
 * В схеме передаём обработчики валидации для полей,
 * обработчик должен вернуть строку с ошибкой или `null`, если всё ок
 */
export interface ValidateRequestSchema {
    [key: string]: (value?: unknown) => string | null;
}

const validateRequestParams = (params: BaseObject, schema: ValidateRequestSchema) => {
    const applyValidators = (key: string) => {
        const validate = schema[key];

        if (key.includes('.')) {
            const keyData = key.split('.');
            const objKey = keyData[0];

            if (typeof params[objKey] === 'object') {
                const subKey = keyData[1];

                return validate((params[objKey] as BaseObject)[subKey]);
            }
        }

        return validate(params[key]);
    };

    const validationCheck = Object.keys(schema).map(applyValidators);

    const errors = validationCheck.filter((v) => v && typeof v === 'string');

    if (errors && errors.length) {
        throw new Error(errors.join('|'));
    }
};

export default validateRequestParams;
