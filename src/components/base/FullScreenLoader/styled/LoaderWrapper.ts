import styled from 'styled-components';

export const LoaderWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;

    display: flex;

    justify-content: center;
    align-items: center;

    height: 100vh;
    width: 100%;

    background-color: rgba(255, 255, 255, 0.84);

    z-index: 1000000;
`;
