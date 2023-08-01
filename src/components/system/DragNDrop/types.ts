export interface ChangableStyles {
    top: number;
    left: number;
    right: number;
    marginTop: number;
    marginLeft?: number | 'auto';
    marginRight?: number | 'auto';
    width: string | number;
    height: number;
    isHeightChanged?: boolean;
}

export type PositionStyles = Omit<ChangableStyles, 'width' | 'height'>;
