'use client';

import React from 'react';
import { Button, Input } from 'antd';
import { Column, Row } from '@/components/base/Grid';
import { ELEMENT_STYLES } from '../../../../Collection/constants';

interface KeyValueFieldProps {
    id: string;
    keyField: string;
    valueField?: string | number | boolean;
    onChange: (field: 'key' | 'value', newValue: string) => void;
    onDelete: () => void;
}

export default function KeyValueField({ id, keyField, valueField, onChange, onDelete }: KeyValueFieldProps) {
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'key' | 'value') => {
        const newValue = e.target.value;

        onChange(field, newValue);
    };

    return (
        <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
            <Column cols={5}>
                <Input
                    id={`${id}-key`}
                    placeholder="Название"
                    value={keyField}
                    onChange={(e) => onFieldChange(e, 'key')}
                />
            </Column>
            <Column cols={5}>
                <Input
                    id={`${id}-value`}
                    placeholder="Значение"
                    value={String(valueField)}
                    onChange={(e) => onFieldChange(e, 'value')}
                />
            </Column>
            <Column cols={2}>
                <Button style={ELEMENT_STYLES.formButton} danger onClick={onDelete}>
                    Удалить
                </Button>
            </Column>
        </Row>
    );
}
