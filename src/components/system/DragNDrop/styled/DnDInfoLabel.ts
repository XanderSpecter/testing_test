import styled from 'styled-components';

export const DnDInfoLabel = styled.div`
    position: absolute;

    top: calc(100% + 4px);
    left: 0;

    padding: 4px;

    background-color: #1677ff;

    color: #ffffff;

    border-radius: 8px;

    z-index: 1;

    white-space: nowrap;

    & * {
        color: #ffffff;
    }
`;
