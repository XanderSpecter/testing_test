import styled from 'styled-components';
import { RESIZER_WIDTH } from '../constants';

export const DragNDropWrapper = styled.div.attrs((props) => ({
    style: { ...props.style },
}))`
    position: absolute;
    cursor: move;

    padding: ${RESIZER_WIDTH}px;
`;
