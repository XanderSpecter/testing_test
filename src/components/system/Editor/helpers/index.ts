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
