import { ElementType, HTMLTag, StyleType } from '@/types/HTMLElements';

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
        label: 'Контейнер сетки',
        value: ElementType.CONTAINER,
    },
    {
        label: 'React-компонент',
        value: ElementType.COMPONENT,
        disabled: true,
    },
];

export const STYLE_TYPES = [
    {
        label: 'Базовые стили',
        value: StyleType.BASE,
    },
    {
        label: 'Стили при наведении',
        value: StyleType.HOVER,
    },
    {
        label: 'Стили при фокусе',
        value: StyleType.FOCUS,
    },
];

export const AVAILABLE_TAGS: HTMLTag[] = [
    'a',
    'b',
    'button',
    'div',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'img',
    'li',
    'nav',
    'p',
    'pre',
    'section',
    'span',
    'strong',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'ul',
];

export const AVAILABLE_TAGS_ITEMS = AVAILABLE_TAGS.map((t) => ({ label: t, value: t }));
