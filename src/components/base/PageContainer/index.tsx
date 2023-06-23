import React from 'react';
import { ContentWrapper } from './styled';

interface PageContainerProps {
    children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
    return <ContentWrapper>{children}</ContentWrapper>;
};

export default PageContainer;
