import styled from 'styled-components';
import { SCROLLBAR_SIZE, RESIZER_SIZE } from '../constants';

export const Scrollable = styled.div`
    position: absolute;

    top: 0;
    bottom: 0;
    left: 0;
    right: ${RESIZER_SIZE}px;

    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        width: ${SCROLLBAR_SIZE}px;
        height: ${SCROLLBAR_SIZE}px;
    }

    &::-webkit-scrollbar-track {
        background-color: rgba(22, 119, 255, 10%);
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(22, 119, 255, 70%);
        border-radius: ${SCROLLBAR_SIZE / 2}px;
    }

    ::-webkit-resizer,
    ::-webkit-scrollbar-button,
    ::-webkit-scrollbar-corner {
        display: none;
    }
`;
