import { AvailableCollection } from '@/types/collections';

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
        defaultSortKey: 'screen',
        fieldsMapping: {
            name: {
                title: 'Название контрольной точки',
                shortcut: 'Имя',
                type: 'string',
                required: true,
                mustBeUnique: true,
                description: 'Должно быть уникальным.',
            },
            screen: {
                title: 'Размер экрана для применения контрольной точки',
                shortcut: 'Ширина экрана',
                type: 'number',
                required: true,
                mustBeUnique: true,
                description: 'Должно быть уникальным целым положительным числом.',
            },
            maxCols: {
                title: 'Максимальное количество колонок сетки для указанной контрольной точки',
                shortcut: 'Маск. колонок сетки',
                type: 'number',
                required: false,
                mustBeUnique: true,
                description: 'Должно быть целым положительным числом.',
            },
        },
    },
];
