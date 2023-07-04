import styled from 'styled-components';
import { HEADER_HEIGHT } from '../constants';

export const HeaderWrapper = styled.div`
    position: sticky;
    top: 0;

    background-color: #ffffff;

    width: 100%;
    height: ${HEADER_HEIGHT}px;
    padding: 8px 16px;
    box-sizing: border-box;

    display: flex;
    align-items: center;

    box-shadow: 0px 1px 2px rgba(0, 0, 0, 50%);

    z-index: 10;
`;
