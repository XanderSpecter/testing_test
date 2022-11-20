interface CommonStyles {
    width?: string;
    height?: string;
}

/**
 * Расширение компонента для поддержки редактируемых стилей в Styled
 */
export interface WithCommonStyles {
    styles?: CommonStyles;
}

export type AllowedMethod = 'POST' | 'GET';
