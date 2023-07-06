import styled, { css } from 'styled-components';
import { DnDResizerPosition } from './DnDResizer';

export interface DnDResizerLabelProps {
    position: DnDResizerPosition;
    distanceLabel?: string | number;
    distance?: number;
}

const calcStyles = ({ position, distance }: DnDResizerLabelProps) => {
    if (!position || !distance) {
        return css``;
    }

    switch (position) {
        case DnDResizerPosition.RIGHT:
            return css`
                top: 50%;
                transform: translate(-50%, -50%);
                border-radius: 4px;
                left: calc(100% + ${distance / 2}px);
            `;
        case DnDResizerPosition.LEFT:
            return css`
                top: 50%;
                transform: translate(50%, -50%);
                border-radius: 4px;
                right: calc(100% + ${distance / 2}px);
            `;
        default:
            return css`
                left: 50%;
                transform: translate(-50%, 50%);
                border-radius: 4px;
                bottom: calc(100% + ${distance / 2}px);
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

    ${(props) => calcStyles(props)};

    & * {
        color: #ffffff;

        font-size: 10px;
        line-height: 12px;

        display: block;

        white-space: nowrap;
    }
`;
