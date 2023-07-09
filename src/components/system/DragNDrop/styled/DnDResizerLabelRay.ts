import styled, { css } from 'styled-components';
import { DnDResizerPosition } from './DnDResizer';
import { RESIZER_SIZE } from '../../Editor/constants';

export interface DnDResizerLabelProps {
    position: DnDResizerPosition;
    role: 'before' | 'after';
    distance?: number;
}

const calcStyles = ({ position, role }: DnDResizerLabelProps) => {
    if (!position || !role) {
        return css``;
    }

    switch (position) {
        case DnDResizerPosition.RIGHT:
            return css`
                top: calc(50% - ${RESIZER_SIZE / 2}px);
                ${role === 'before' ? 'right: 50%' : 'left: 50%'};
            `;
        case DnDResizerPosition.LEFT:
            return css`
                top: calc(50% - ${RESIZER_SIZE / 2}px);
                ${role === 'before' ? 'left: 50%' : 'right: 50%'};
            `;
        default:
            return css`
                left: calc(50% - ${RESIZER_SIZE / 2}px);
                ${role === 'before' ? 'top: 50%' : 'bottom: 50%'};
            `;
    }
};

const getAttr = ({ position, distance }: DnDResizerLabelProps) => {
    if (!position || !distance) {
        return {};
    }

    switch (position) {
        case DnDResizerPosition.RIGHT:
            return { width: `${distance / 2}px`, height: `${RESIZER_SIZE}px` };
        case DnDResizerPosition.LEFT:
            return { width: `${distance / 2}px`, height: `${RESIZER_SIZE}px` };
        default:
            return { height: `${distance / 2}px`, width: `${RESIZER_SIZE}px` };
    }
};

export const DnDResizerLabelRay = styled.div.attrs<DnDResizerLabelProps>((props) => ({
    style: getAttr(props),
}))`
    position: absolute;

    background-color: #1677ff;

    z-index: -1;

    ${(props) => calcStyles(props)};
`;
