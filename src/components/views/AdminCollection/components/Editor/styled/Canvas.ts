import styled from 'styled-components';

export const Canvas = styled.div.attrs((props) => ({
    style: { ...props.style },
}))`
    container-type: size;
    container-name: editor;

    position: relative;

    margin: auto;

    max-height: 100vh;
`;
