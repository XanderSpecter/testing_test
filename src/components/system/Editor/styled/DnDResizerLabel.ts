import styled, { css } from 'styled-components';
import { DnDResizerPosition } from './DnDResizer';

interface DnDResizerLabelProps {
    position: DnDResizerPosition;
    distance?: string | number;
}

const calcStyles = (pos: DnDResizerPosition, distance?: string | number) => {
    if (!pos || !distance) {
        return css``;
    }

    switch (pos) {
        case DnDResizerPosition.RIGHT:
            return css`
                top: 0;
                right: 0;
                bottom: 0;
            `;
        case DnDResizerPosition.LEFT:
            return css`
                top: 0;
                left: 0;
                bottom: 0;
            `;
        case DnDResizerPosition.BOTTOM:
            return css`
                left: 0;
                right: 0;
                bottom: 0;
            `;
        default:
            return css`
                left: 50%;
                transform: translateX(-50%);
                border-radius: 4px;
                top: -50%;
            `;
    }
};

export const DnDResizerLabel = styled.div<DnDResizerLabelProps>`
    position: absolute;

    padding-left: 2px;
    padding-right: 2px;

    background-color: #1677ff;

    color: #ffffff;

    min-width: 30px;

    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1;

    ${(props) => calcStyles(props.position, props.distance)};

    & * {
        color: #ffffff;

        font-size: 10px;
        line-height: 12px;

        display: block;
    }
`;
