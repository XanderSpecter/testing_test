import styled, { css } from 'styled-components';
import { DnDResizerPosition } from './DnDResizer';
import { RESIZER_SIZE } from '../../Editor/constants';

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

                &::before,
                &::after {
                    content: '';

                    position: absolute;

                    background-color: #1677ff;

                    height: ${RESIZER_SIZE}px;
                    width: ${distance / 2}px;

                    z-index: -1;

                    top: calc(50% - ${RESIZER_SIZE / 2}px);
                }

                &::before {
                    right: 50%;
                }

                &::after {
                    left: 50%;
                }
            `;
        case DnDResizerPosition.LEFT:
            return css`
                top: 50%;
                transform: translate(50%, -50%);
                border-radius: 4px;

                &::before,
                &::after {
                    content: '';

                    position: absolute;

                    background-color: #1677ff;

                    height: ${RESIZER_SIZE}px;
                    width: ${distance / 2}px;

                    z-index: -1;

                    top: calc(50% - ${RESIZER_SIZE / 2}px);
                }

                &::before {
                    left: 50%;
                }

                &::after {
                    right: 50%;
                }
            `;
        default:
            return css`
                left: 50%;
                transform: translate(-50%, 50%);
                border-radius: 4px;

                &::before,
                &::after {
                    content: '';

                    position: absolute;

                    background-color: #1677ff;

                    width: ${RESIZER_SIZE}px;
                    height: ${distance / 2}px;

                    z-index: -1;

                    left: calc(50% - ${RESIZER_SIZE / 2}px);
                }

                &::before {
                    top: 50%;
                }

                &::after {
                    bottom: 50%;
                }
            `;
    }
};

const getAttr = ({ position, distance }: DnDResizerLabelProps) => {
    if (!position || !distance) {
        return {};
    }

    switch (position) {
        case DnDResizerPosition.RIGHT:
            return { left: `calc(100% + ${distance / 2}px` };
        case DnDResizerPosition.LEFT:
            return { right: `calc(100% + ${distance / 2}px` };
        default:
            return { bottom: `calc(100% + ${distance / 2}px` };
    }
};

export const DnDResizerLabel = styled.div.attrs<DnDResizerLabelProps>((props) => ({
    style: getAttr(props),
}))`
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
