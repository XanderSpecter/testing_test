import styled, { css } from 'styled-components';
import { RESIZER_SIZE } from '../constants';

export enum DnDResizerPosition {
    TOP = 'TOP',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
}

const calcStyles = (pos: DnDResizerPosition) => {
    if (!pos) {
        return css``;
    }

    switch (pos) {
        case DnDResizerPosition.RIGHT:
            return css`
                top: 0;
                right: 0;
                bottom: 0;
                width: ${RESIZER_SIZE}px;
                cursor: ew-resize;
            `;
        case DnDResizerPosition.LEFT:
            return css`
                top: 0;
                left: 0;
                bottom: 0;
                width: ${RESIZER_SIZE}px;
                cursor: ew-resize;
            `;
        case DnDResizerPosition.BOTTOM:
            return css`
                left: 0;
                right: 0;
                bottom: 0;
                height: ${RESIZER_SIZE}px;
                cursor: ns-resize;
            `;
        default:
            return css`
                left: 0;
                right: 0;
                top: 0;
                height: ${RESIZER_SIZE}px;
                cursor: ns-resize;
            `;
    }
};

export const DnDResizer = styled.div<{ position: DnDResizerPosition }>`
    position: absolute;
    cursor: ew-resize;

    background-color: #1677ff;

    ${(props) => calcStyles(props.position)};
`;
