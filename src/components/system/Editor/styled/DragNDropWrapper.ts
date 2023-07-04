import styled from 'styled-components';

export const DragNDropWrapper = styled.div.attrs((props) => ({
    style: { ...props.style },
}))`
    position: absolute;
    cursor: move;

    display: flex;
    justify-content: center;
    align-items: center;

    border: 1px solid rgba(22, 119, 255, 10%);
`;
