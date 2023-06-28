import { AvailableCollection } from '@/types/collections';
import {
    posBreakpointtCollectionSchema,
    putBreakpointCollectionSchema,
} from '@/utils/validation/schemas/breakpointsCollection';

export const AVAILABLE_COLLECTIONS: AvailableCollection[] = [
    {
        name: 'page',
        title: 'Страницы',
    },
    {
        name: 'zone',
        title: 'Статические зоны',
    },
    {
        name: 'breakpoints',
        title: 'Параметры контрольных точек размера экрана',
        schemas: {
            PUT: putBreakpointCollectionSchema,
            POST: posBreakpointtCollectionSchema,
        },
    },
];
