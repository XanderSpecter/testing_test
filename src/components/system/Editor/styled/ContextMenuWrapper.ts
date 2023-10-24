import styled from 'styled-components';

interface ContextMenuWrapperProps {
    $visible?: boolean;
}

export const ContextMenuWrapper = styled.div.attrs<ContextMenuWrapperProps>((props) => ({
    style: { ...props.style },
}))`
    position: absolute;
    padding: 4px;
    padding-top: 0;
    background-color: #ffffff;
    z-index: 10;

    display: flex;
    flex-direction: column;

    border-radius: 4px;

    box-shadow: 0px 1px 2px rgba(0, 0, 0, 50%);

    visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};

    & > * {
        margin-top: 4px;
    }
`;
