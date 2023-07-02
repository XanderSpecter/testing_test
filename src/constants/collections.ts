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
        uniqueFields: ['screen'],
        defaultSortKey: 'screen',
        fieldsMapping: {
            name: {
                title: 'Название контрольной точки',
                shortcut: 'Имя',
                description: 'Должно быть уникальным.',
            },
            screen: {
                title: 'Размер экрана для применения контрольной точки',
                shortcut: 'Ширина экрана',
                description: 'Должно быть уникальным целым положительным числом.',
            },
            maxCols: {
                title: 'Максимальное количество колонок сетки для указанной контрольной точки',
                shortcut: 'Маск. колонок сетки',
                description: 'Должно быть целым положительным числом.',
            },
        },
        schemas: {
            PUT: putBreakpointCollectionSchema,
            POST: posBreakpointtCollectionSchema,
        },
    },
];
