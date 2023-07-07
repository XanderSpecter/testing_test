import { ElementType } from '@/types/HTMLElements';

export const PAGE_BLOCK_TYPES = [
    {
        label: 'HTML-элемент',
        value: ElementType.HTMLELEMENT,
    },
    {
        label: 'Текст',
        value: ElementType.TEXT,
    },
    {
        label: 'React-компонент',
        value: ElementType.COMPONENT,
        disabled: true,
    },
];
