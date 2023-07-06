import { CSSProperties } from 'react';

export type StylesByBreakpoint = Record<string, CSSProperties | undefined>;

export type WithBreakpointStyles<T> = Omit<T, 'stylesByBreakpoint'> & {
    stylesByBreakpoint?: StylesByBreakpoint | null;
};

export type WithEditorSupport<T> = Omit<T, 'editor'> & {
    editing?: boolean;
};
/**
 * Расширение компонента для поддержки редактируемых стилей в Styled
 */
export interface WithCommonStyles {
    customStyles?: CSSProperties;
}

export enum ElementType {
    TEXT = 'TEXT',
    HTMLELEMENT = 'HTMLELEMENT',
    COMPONENT = 'COMPONENT',
}

interface BlockParams {
    type: ElementType;
    editorId: string;
    tag: keyof HTMLElementTagNameMap;
    stylesByBreakpoint?: StylesByBreakpoint | null;
}

export type BaseBlockParams = WithBreakpointStyles<BlockParams>;
