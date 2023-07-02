import { BaseObject } from '@/types/apiModels';
import validateSchema, { ValidateSchema } from '@/utils/validation/validateSchema';

const validateRequestParams = (params: BaseObject, schema: ValidateSchema) => {
    const errors = validateSchema(params, schema);

    if (errors) {
        const errorValues = Object.values(errors);

        let message = '';

        errorValues.forEach((v, i) => {
            if (i >= errorValues.length - 1) {
                message += v;

                return;
            }

            message += `${v} | `;
        });

        throw new Error(message);
    }
};

export default validateRequestParams;