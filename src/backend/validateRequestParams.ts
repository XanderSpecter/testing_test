import { BaseObject } from '@/types/apiModels';
import concatErrors from '@/utils/validation/concatErrors';
import validateSchema, { ValidationSchema } from '@/utils/validation/validateSchema';

const validateRequestParams = (params: BaseObject, schema: ValidationSchema) => {
    const errors = validateSchema(params, schema);

    if (errors) {
        const message = concatErrors(errors);

        throw new Error(message);
    }
};

export default validateRequestParams;
