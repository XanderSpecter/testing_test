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

type HTMLBlockProps<T extends keyof HTMLElementTagNameMap> = HTMLElementTagNameMap[T];

interface HTMLBlock<T extends keyof HTMLElementTagNameMap = 'div'> {
    type: ElementType.HTMLELEMENT;
    editorId: string;
    tag: keyof HTMLElementTagNameMap;
    content?: string;
    props?: HTMLBlockProps<T>;
}

export type StyledBlock<T extends keyof HTMLElementTagNameMap = 'div'> = WithBreakpointStyles<HTMLBlock<T>>;

export interface TextBlock {
    type: ElementType.TEXT;
    editorId: string;
    value: string;
}

export type PageBlock = StyledBlock | TextBlock;
