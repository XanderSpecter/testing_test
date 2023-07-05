import styled from 'styled-components';
import { SCROLLBAR_WIDTH } from '../constants';

export const Scrollable = styled.div`
    position: absolute;

    top: 0;
    bottom: 0;
    left: 0;
    right: -${SCROLLBAR_WIDTH}px;

    overflow-y: auto;

    &::-webkit-scrollbar {
        width: ${SCROLLBAR_WIDTH}px;
        height: ${SCROLLBAR_WIDTH}px;
    }

    &::-webkit-scrollbar-track {
        background-color: rgba(22, 119, 255, 10%);
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(22, 119, 255, 70%);
        border-radius: ${SCROLLBAR_WIDTH / 2}px;
    }

    ::-webkit-resizer,
    ::-webkit-scrollbar-button,
    ::-webkit-scrollbar-corner {
        display: none;
    }
`;
