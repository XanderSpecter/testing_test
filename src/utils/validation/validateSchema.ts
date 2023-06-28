import { BaseObject } from '@/types/apiModels';

/**
 * В схеме передаём обработчики валидации для полей,
 * обработчик должен вернуть строку с ошибкой или `null`, если всё ок
 */
export interface ValidateSchema {
    [key: string]: (value?: unknown) => string | null;
}

const validateSchema = (object: BaseObject, schema: ValidateSchema) => {
    const applyValidators = (key: string) => {
        const validate = schema[key];

        if (key.includes('.')) {
            const keyData = key.split('.');
            const objKey = keyData[0];

            if (typeof object[objKey] === 'object') {
                const subKey = keyData[1];

                return validate((object[objKey] as BaseObject)[subKey]);
            }
        }

        return validate(object[key]);
    };

    const errors: Record<string, string> = {};

    Object.keys(schema).forEach((key) => {
        const error = applyValidators(key);

        if (error) {
            errors[key] = error;
        }
    });

    return Object.keys(errors).length ? errors : null;
};

export default validateSchema;
