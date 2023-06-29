import { ValidateSchema } from '@/utils/validation/validateSchema';
import { getRequiredParamError } from '../errorMessages';
import isFieldValid from '../isFieldValid';

export const putBreakpointCollectionSchema: ValidateSchema = {
    'element.screen': (v) => (isFieldValid(v, 'number') ? null : getRequiredParamError('screen', 'breakpoints')),
    'element.cols': (v) => (isFieldValid(v, 'number') ? null : getRequiredParamError('cols', 'breakpoints')),
};

export const posBreakpointtCollectionSchema: ValidateSchema = {
    'element.screen': (v) => (isFieldValid(v, 'number') ? null : getRequiredParamError('screen', 'breakpoints')),
    'element.cols': (v) => (isFieldValid(v, 'number') ? null : getRequiredParamError('cols', 'breakpoints')),
};
