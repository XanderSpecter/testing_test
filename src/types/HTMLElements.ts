import { CSSProperties } from 'react';

export type StylesByBreakpoint = Record<string, CSSProperties | undefined>;

export type WithBreakpointStyles<T> = Omit<T, 'stylesByBreakpoint'> & {
    stylesByBreakpoint?: StylesByBreakpoint | null;
};

export type WithGeneratedCSS<T = unknown> = Omit<T, 'styleswithmedia'> & {
    styleswithmedia: string;
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

export enum BlockPosition {
    ABSOLUTE = 'absolute',
    FIXED = 'fixed',
    STICKY = 'sticky',
    RELATIVE = 'relative',
    STATIC = 'static',
}

export type PositionVariant = Extract<BlockPosition, BlockPosition.STATIC | BlockPosition.ABSOLUTE>;

interface BaseBlockParams {
    type: ElementType.HTMLELEMENT;
    editorId: string;
    tag: keyof HTMLElementTagNameMap;
}

export type StyledBlock = WithBreakpointStyles<BaseBlockParams>;

interface BaseTextBlockParams {
    type: ElementType.TEXT;
    editorId: string;
    value: string;
}

export type StyledText = WithBreakpointStyles<BaseTextBlockParams>;

export type PageBlock = StyledBlock | StyledText;
