'use client';

import React from 'react';
import { ContextMenuWrapper } from '../styled';
import { Button } from 'antd';
import { PageBlock } from '@/types/HTMLElements';

export interface HandlerParams {
    path?: PageBlock['path'];
    coordinates?: ContextCoordinates;
}
export interface ContextOption {
    name: string;
    handler: (params: HandlerParams) => void;
}

export interface ContextMenuProps {
    path?: string | null;
    top: number;
    left: number;
    options?: ContextOption[];
}

export type ContextCoordinates = Pick<ContextMenuProps, 'top' | 'left'>;

const ContextMenu = ({ path, options, top, left }: ContextMenuProps) => {
    if (!options) {
        return null;
    }

    const renderOptions = () => {
        if (!options || !path) {
            return null;
        }

        return options.map((o) => {
            if (!o.handler || !o.name) {
                return null;
            }

            return (
                <Button key={o.name} size="small" onClick={() => o.handler({ path, coordinates: { top, left } })}>
                    {o.name}
                </Button>
            );
        });
    };

    return (
        <ContextMenuWrapper visible={path ? 'true' : undefined} style={{ top, left }}>
            {renderOptions()}
        </ContextMenuWrapper>
    );
};

export default ContextMenu;
