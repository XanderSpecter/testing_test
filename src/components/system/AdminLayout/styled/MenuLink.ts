import styled from 'styled-components';

import Link from 'next/link';

export const MenuLink = styled(Link)`
    text-decoration: none;

    color: #1677ff;

    display: block;

    margin-right: 16px;

    & * {
        color: #1677ff;

        margin: 0;
    }

    &:hover {
        text-decoration: none;

        color: #0749a7;

        & * {
            color: #0749a7;
        }
    }
`;
