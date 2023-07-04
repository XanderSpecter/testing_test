import styled from 'styled-components';
import { SCROLLBAR_COMPENSATION } from '../constants';

export const CanvasContainer = styled.div.attrs((props) => ({
    style: { ...props.style },
}))`
    container-type: size;
    container-name: editor;

    position: relative;

    padding-right: ${SCROLLBAR_COMPENSATION}px;

    max-height: 100vh;

    background-color: #ffffff;
`;
