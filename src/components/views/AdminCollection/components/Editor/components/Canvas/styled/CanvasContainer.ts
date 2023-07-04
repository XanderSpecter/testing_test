import styled from 'styled-components';

export const CanvasContainer = styled.div.attrs((props) => ({
    style: { ...props.style },
}))`
    container-type: size;
    container-name: editor;

    position: relative;

    max-height: 100vh;
`;
