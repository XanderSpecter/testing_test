import styled from 'styled-components';
import { RESIZER_SIZE } from '../constants';

export const CanvasContainer = styled.div.attrs((props) => ({
    style: { ...props.style },
}))`
    container-type: size;
    container-name: editor;

    position: relative;

    padding-right: ${RESIZER_SIZE}px;

    max-height: 100%;

    background-color: #ffffff;
`;
