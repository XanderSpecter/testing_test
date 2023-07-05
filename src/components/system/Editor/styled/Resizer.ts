import styled from 'styled-components';
import { RESIZER_WIDTH } from '../constants';

export const Resizer = styled.div`
    position: absolute;
    cursor: ew-resize;

    top: 0;
    right: 0px;
    bottom: 0;
    width: ${RESIZER_WIDTH}px;
    background-color: #1677ff;
`;
