interface CommonStyles {
    width?: string;
    height?: string;
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
}

/**
 * Расширение компонента для поддержки редактируемых стилей в Styled
 */
export interface WithCommonStyles {
    customStyles?: CommonStyles;
}
