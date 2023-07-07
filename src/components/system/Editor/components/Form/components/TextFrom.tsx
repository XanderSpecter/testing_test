'use client';

import React from 'react';
import { Input, Typography } from 'antd';
import { Column, Row } from '@/components/base/Grid';
import { TextBlock } from '@/types/HTMLElements';
import { ELEMENT_STYLES } from '../../../../Collection/constants';

interface TextFormProps {
    onFieldChange: (fieldName: keyof TextBlock, newValue: string) => void;
    block: TextBlock;
}

export default function TextForm({ block, onFieldChange }: TextFormProps) {
    const { value, editorId } = block;

    const onInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onFieldChange && typeof onFieldChange === 'function') {
            onFieldChange('value', e.target.value);
        }
    };

    return (
        <>
            <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
                <Column>
                    <Typography>Текст</Typography>
                </Column>
            </Row>
            <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                <Column>
                    <Input
                        id={editorId}
                        placeholder="Здесь могла быть ваша реклама"
                        value={value}
                        onChange={onInputFieldChange}
                    />
                </Column>
            </Row>
        </>
    );
}
