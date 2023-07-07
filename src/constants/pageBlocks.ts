import { ElementType } from '@/types/HTMLElements';

export const PAGE_BLOCK_TYPES = [
    {
        label: 'HTML-элемент',
        value: ElementType.HTMLELEMENT,
        description: 'Элемент разметки, с поддержкой настройки стилей, позиционирования и т.д.',
    },
    {
        label: 'Текст',
        value: ElementType.TEXT,
        description: 'Простой текст, без гибкой настройки стилей. Может быть дочерним элементом в HTML-элементе',
    },
    {
        label: 'React-компонент',
        value: ElementType.COMPONENT,
        disabled: true,
        description:
            'Полноценный компонент, содержащий в себе стили и внутреннюю логику, например, текстовое поле ввода (в разработке)',
    },
];
