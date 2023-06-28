import { ValidateSchema } from '@/utils/validation/validateSchema';

interface CollectionValidationSchemas {
    GET?: ValidateSchema;
    POST?: ValidateSchema;
    PUT?: ValidateSchema;
    DELETE?: ValidateSchema;
}

export interface AvailableCollection {
    name: string;
    title: string;
    schemas?: CollectionValidationSchemas;
}
