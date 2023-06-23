import React from 'react';
import { Spin } from 'antd';

import { LoaderWrapper } from './styled';

interface FullScreenLoaderProps {
    show: boolean;
}

const FullScreenLoader = ({ show }: FullScreenLoaderProps) => {
    if (!show) {
        return null;
    }

    return (
        <LoaderWrapper>
            <Spin size="large" />
        </LoaderWrapper>
    );
};

export default FullScreenLoader;
