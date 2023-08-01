import styled from 'styled-components';

interface HeaderLinksWrapperProps {
    alignContent: 'flex-start' | 'flex-end';
}

export const HeaderLinksWrapper = styled.div<HeaderLinksWrapperProps>`
    width: 50%;
    padding: 8px 0;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: ${(props) => props.alignContent};
`;
