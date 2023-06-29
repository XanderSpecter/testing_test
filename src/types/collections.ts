import { ValidateSchema } from '@/utils/validation/validateSchema';

interface CollectionValidationSchemas {
    GET?: ValidateSchema;
    POST?: ValidateSchema;
    PUT?: ValidateSchema;
    DELETE?: ValidateSchema;
}

interface FieldParams {
    title: string;
    shortcut: string;
    description?: string;
}

export interface AvailableCollection {
    name: string;
    title: string;
    uniqueFields?: string[];
    fieldsMapping?: Record<string, FieldParams>;
    schemas?: CollectionValidationSchemas;
}
