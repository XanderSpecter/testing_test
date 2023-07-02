'use client';

import React from 'react';
import { Input, Checkbox, Typography } from 'antd';
import { FormEditableFieldType } from '@/types/apiModels';
import { Column, Row } from '@/components/base/Grid';
import { isTypeEditable } from '../helpers';
import { ELEMENT_STYLES } from '../constants';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

export type FieldValue<T extends FormEditableFieldType> = T extends 'string'
    ? string
    : T extends 'number'
    ? number
    : boolean;

interface FormFieldProps<T extends FormEditableFieldType> {
    type: T;
    id: string;
    title: string;
    description?: string;
    disabled?: boolean;
    value?: FieldValue<T>;
    onChange: (newValue: FieldValue<T>) => void;
}

const { Title } = Typography;

export default function FormField<T extends FormEditableFieldType>({
    type,
    id,
    title,
    description,
    disabled,
    value,
    onChange,
}: FormFieldProps<T>) {
    if (!isTypeEditable(type) || !title || !onChange) {
        return null;
    }

    const onInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>, type: FormEditableFieldType) => {
        if (onChange && typeof onChange === 'function') {
            const newValue = type === 'number' ? parseFloat(e.target.value) : e.target.value;

            onChange(newValue as FieldValue<T>);
        }
    };

    const onCheckboxFieldChange = (e: CheckboxChangeEvent) => {
        if (onChange && typeof onChange === 'function') {
            onChange(e.target.checked as FieldValue<T>);
        }
    };

    const renderFieldByType = () => {
        if (!isTypeEditable(type)) {
            return null;
        }

        switch (type) {
            case 'number':
                return (
                    <Input
                        type="number"
                        id={id}
                        disabled={disabled}
                        placeholder={description}
                        value={Number(value)}
                        onChange={(e) => onInputFieldChange(e, 'number')}
                    />
                );
            case 'boolean':
                return (
                    <Checkbox disabled={disabled} id={id} checked={Boolean(value)} onChange={onCheckboxFieldChange} />
                );
            default:
                return (
                    <Input
                        disabled={disabled}
                        id={id}
                        placeholder={description}
                        value={String(value)}
                        onChange={(e) => onInputFieldChange(e, 'string')}
                    />
                );
        }
    };

    return (
        <>
            <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
                <Column>
                    <Title level={5}>{title}</Title>
                </Column>
            </Row>
            <Row>
                <Column>{renderFieldByType()}</Column>
            </Row>
        </>
    );
}
