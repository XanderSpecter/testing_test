import { get } from 'lodash';
import { BaseObject, FieldsErrors } from '@/types/apiModels';

/**
 * В схеме передаём обработчики валидации для полей,
 * обработчик должен вернуть строку с ошибкой или `null`, если всё ок
 */
export interface ValidationSchema {
    [key: string]: (value?: unknown) => string | null;
}

const validateSchema = <T extends BaseObject>(object: T, schema: ValidationSchema) => {
    const errors: FieldsErrors = {};

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
