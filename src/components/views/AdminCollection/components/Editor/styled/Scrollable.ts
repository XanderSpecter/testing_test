import styled from 'styled-components';

export const Scrollable = styled.div`
    position: relative;

    width: 100%;
    height: 100vh;

    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 8px;
        position: absolute;
        right: 4px;
    }

    &::-webkit-scrollbar-track {
        background-color: rgba(22, 119, 255, 45%);
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(22, 119, 255, 70%);
        border-radius: 4px;
    }

    ::-webkit-resizer,
    ::-webkit-scrollbar-button,
    ::-webkit-scrollbar-corner {
        display: none;
    }
`;
