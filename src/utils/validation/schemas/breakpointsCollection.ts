import { ValidateSchema } from '@/utils/validation/validateSchema';
import { getRequiredParamError } from '../errorMessages';

export const putBreakpointCollectionSchema: ValidateSchema = {
    'element.screen': (v) => (!!v ? null : getRequiredParamError('element.screen')),
};

export const posBreakpointtCollectionSchema: ValidateSchema = {
    'element.screen': (v) => (!!v ? null : getRequiredParamError('element.screen')),
};
