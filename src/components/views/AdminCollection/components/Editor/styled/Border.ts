import styled, { css } from 'styled-components';

export interface BorderProps {
    position: 'left' | 'right';
}

const calcStyles = (position: BorderProps['position']) => {
    switch (position) {
        case 'left':
            return css`
                top: 0;
                left: -3px;
                bottom: 0;
                width: 3px;
                background-color: #1677ff;
            `;
        default:
            return css`
                top: 0;
                right: -3px;
                bottom: 0;
                width: 3px;
                background-color: #1677ff;
            `;
    }
};

export const Border = styled.div<BorderProps>`
    position: absolute;
    cursor: ew-resize;

    ${(props) => calcStyles(props.position)};
`;
