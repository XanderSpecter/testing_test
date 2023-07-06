import styled from 'styled-components';

export const DragNDropWrapper = styled.div.attrs((props) => ({
    style: { ...props.style },
}))`
    cursor: move;
`;
