import { CSSPropertyKey } from '@/types/HTMLElements';
import { CSSProperties } from 'react';

interface RecalcWidthAndMarginsParams {
    width?: string | number;
    marginLeft?: string | number;
    screenWidth: number;
}

export const recalcWidthAndMargins = ({ width, marginLeft, screenWidth }: RecalcWidthAndMarginsParams) => {
    let calculatedWidth = 0;

    if (typeof width === 'number') {
        calculatedWidth = width;
    }

    if (typeof width === 'string' && width.includes('%')) {
        const widthPercent = parseInt(width);

        calculatedWidth = Math.round(screenWidth / widthPercent);
    }

    const calculatedMarginLeft =
        typeof marginLeft === 'number' ? marginLeft : Math.round((screenWidth - calculatedWidth) / 2);

    const calculatedMarginRight = screenWidth - (calculatedMarginLeft + calculatedWidth);

    return {
        calculatedWidth,
        calculatedMarginLeft,
        calculatedMarginRight,
    };
};

const DND_CHANGABLE_STYLES: CSSPropertyKey[] = [
    'width',
    'height',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'top',
    'bottom',
    'left',
    'right',
];

export const filterOnlyDnDStyles = (styles: CSSProperties) => {
    const filtered: Record<string, unknown> = {};

    if (!styles) {
        return filtered as CSSProperties;
    }

    Object.keys(styles).forEach((k) => {
        if (DND_CHANGABLE_STYLES.includes(k as CSSPropertyKey)) {
            filtered[k] = styles[k as CSSPropertyKey];
        }
    });

    return filtered as CSSProperties;
};
