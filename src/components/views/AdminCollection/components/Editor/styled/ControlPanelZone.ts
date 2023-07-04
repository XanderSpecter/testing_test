import styled from 'styled-components';
import { CONTROL_PANEL_WIDTH } from '../constants';

export const ControlPanelZone = styled.div`
    position: relative;

    border-left: 1px solid rgba(22, 119, 255, 10%);

    box-sizing: border-box;

    width: ${CONTROL_PANEL_WIDTH}px;
    height: 100vh;
`;
