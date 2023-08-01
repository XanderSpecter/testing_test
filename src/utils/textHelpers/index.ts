export const camelToKebabCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const parseNumber = (str: string) => {
    const parsed = parseInt(str);

    if (!parsed || Number.isNaN(parsed)) {
        return 0;
    }

    return parsed;
};
