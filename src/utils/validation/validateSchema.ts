import { get } from 'lodash';
import { BaseObject } from '@/types/apiModels';

/**
 * В схеме передаём обработчики валидации для полей,
 * обработчик должен вернуть строку с ошибкой или `null`, если всё ок
 */
export interface ValidateSchema {
    [key: string]: (value?: unknown) => string | null;
}

const validateSchema = <T extends BaseObject>(object: T, schema: ValidateSchema) => {
    const errors: Record<string, string> = {};

    Object.keys(schema).forEach((key) => {
        const validate = schema[key];
        const value = get(object, key, null);

        const error = validate(value);

        if (error) {
            errors[key] = error;
        }
    });

    return Object.keys(errors).length ? errors : null;
};

export default validateSchema;
