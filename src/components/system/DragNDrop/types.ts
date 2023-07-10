export interface ChangableStyles {
    top: number;
    left: number;
    right: number;
    marginTop: number;
    marginLeft: string | number;
    marginRight: string | number;
    width: string | number;
    height: number;
}

export type PositionStyles = Omit<ChangableStyles, 'width' | 'height'>;
