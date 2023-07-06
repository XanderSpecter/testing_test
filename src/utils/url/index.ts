export const concatUrlFromPathParams = (baseUrl: string, pathParams?: string | string[]) => {
    if (!pathParams) {
        return baseUrl;
    }

    if (Array.isArray(pathParams)) {
        let url = baseUrl;

        pathParams.forEach((p) => {
            url += `/${p}`;
        });

        return url.replace('//', '/');
    }

    return `${baseUrl}${pathParams}`;
};
