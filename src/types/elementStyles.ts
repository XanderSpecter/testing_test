import { CSSProperties, PropsWithChildren } from 'react';

export type StylesByBreakpoint = Record<string, CSSProperties | undefined>;

export type WithBreakpointStyles<T extends PropsWithChildren = PropsWithChildren> = Omit<T, 'stylesByBreakpoint'> & {
    stylesByBreakpoint?: StylesByBreakpoint | null;
};

export type WithEditing<T extends PropsWithChildren = PropsWithChildren> = Omit<T, 'isEditing'> & {
    isEditing?: boolean;
};
/**
 * Расширение компонента для поддержки редактируемых стилей в Styled
 */
export interface WithCommonStyles {
    customStyles?: CSSProperties;
}
