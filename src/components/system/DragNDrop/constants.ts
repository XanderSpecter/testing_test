import { BlockPosition, CSSPropertyKey } from '@/types/HTMLElements';
import { CSSProperties } from 'react';

export const ACCURACY_TOLERANCE = 15;

export const MOUSEDOWN_LEFT_BUTTON = 0;

export const BLOCK_POSITIONS_STATIC = [BlockPosition.STATIC, BlockPosition.RELATIVE];

export const DEFAULT_POSITION_STYLES = {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    top: 0,
    left: 0,
    right: 0,
    height: 0,
};

export const DEFAULT_ELEMENT_STYLES: CSSProperties = { width: '100%', height: 'auto', position: 'relative' };

export const STATIC_POSITION_STYLES: CSSPropertyKey[] = [
    'width',
    'height',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
];

export const ABSOLUTE_POSITION_STYLES: CSSPropertyKey[] = ['width', 'height', 'top', 'bottom', 'left', 'right'];
