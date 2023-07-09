import { CSSProperties } from 'react';

export enum StyleType {
    BASE = '',
    HOVER = 'hover',
    FOCUS = 'focus',
}

export interface StyleByBreakpoint extends CSSProperties {
    [StyleType.HOVER]?: CSSProperties;
    [StyleType.FOCUS]?: CSSProperties;
}
export interface BlockStyleRecord {
    key: keyof StyleByBreakpoint;
    value?: string | number;
}

export type StylesByBreakpoint = Record<string, StyleByBreakpoint | undefined>;

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

export interface BlockPropRecord {
    key: string;
    value: string | number | boolean;
}

type HTMLBlockProps = Record<BlockPropRecord['key'], BlockPropRecord['value']>;
interface HTMLBlock {
    type: ElementType.HTMLELEMENT;
    parentId?: string | null;
    editorId: string;
    tag: keyof HTMLElementTagNameMap;
    props?: HTMLBlockProps;
}

export type StyledBlock = WithBreakpointStyles<HTMLBlock>;

export interface TextBlock {
    type: ElementType.TEXT;
    parentId?: string | null;
    editorId: string;
    value: string;
}

export type PageBlock = StyledBlock | TextBlock;
