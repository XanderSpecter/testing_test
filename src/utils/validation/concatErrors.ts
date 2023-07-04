import { FieldsErrors } from '@/types/apiModels';

const concatErrors = (errors?: FieldsErrors | null) => {
    if (!errors) {
        return '';
    }

    const errorValues = Object.values(errors);

    if (!errorValues || !errorValues.length) {
        return '';
    }

    let message = '';

    errorValues.forEach((v, i) => {
        if (i >= errorValues.length - 1) {
            message += v;

            return;
        }

        message += `${v} | `;
    });

    return message;
};

export default concatErrors;
