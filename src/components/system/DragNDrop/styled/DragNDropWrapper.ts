import styled from 'styled-components';

export const DragNDropWrapper = styled.div.attrs((props) => ({
    style: { ...props.style },
}))`
    box-sizing: border-box;
    cursor: move;
    position: absolute;
`;
