'use client';

import React from 'react';
import { Typography } from 'antd';

import { HeaderLinksWrapper, HeaderWrapper, MenuLink } from '../styled';
import { getCorrectCollections } from '@/utils/collections';

const collections = getCorrectCollections();

const { Text } = Typography;

export default function Header({ children }: React.PropsWithChildren) {
    const renderLinks = () => {
        if (!collections.length) {
            return null;
        }

        return collections.map((c) => (
            <MenuLink key={c.name} href={`/admin/${c.name}`}>
                <Text>{c.title}</Text>
            </MenuLink>
        ));
    };

    return (
        <HeaderWrapper>
            <HeaderLinksWrapper>{renderLinks()}</HeaderLinksWrapper>
            <HeaderLinksWrapper>{children}</HeaderLinksWrapper>
        </HeaderWrapper>
    );
}
