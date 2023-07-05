import styled from 'styled-components';
import { HEADER_HEIGHT } from '../../AdminLayout/constants';

export const CanvasWrapper = styled.div`
    position: relative;

    width: 100%;
    height: calc(100vh - ${HEADER_HEIGHT}px);

    background-color: rgba(0, 0, 0, 10%);
`;
