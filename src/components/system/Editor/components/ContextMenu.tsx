'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import { ContextMenuWrapper } from '../styled';
import { Button } from 'antd';

export interface ContextOption {
    name: string;
    handler: (editorId: string) => void;
}

export interface ContextMenuProps {
    editorId?: string | null;
    top: number;
    left: number;
    options?: ContextOption[];
}

const ContextMenu = ({ editorId, options, top, left }: ContextMenuProps) => {
    if (!options) {
        return null;
    }

    const renderOptions = () => {
        if (!options || !editorId) {
            return null;
        }

        return options.map((o) => {
            if (!o.handler || !o.name) {
                return null;
            }

            return (
                <Button key={o.name} size="small" onClick={() => o.handler(editorId)}>
                    {o.name}
                </Button>
            );
        });
    };

    return ReactDOM.createPortal(
        <ContextMenuWrapper visible={!!editorId} style={{ top, left }}>
            {renderOptions()}
        </ContextMenuWrapper>,
        document?.body
    );
};

export default ContextMenu;
