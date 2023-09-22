'use client';

import React from 'react';
import { Input, Checkbox, Typography, InputNumber } from 'antd';
import { FormEditableFieldType, PossibleFieldType } from '@/types/apiModels';
import { Column, Row } from '@/components/base/Grid';
import { isTypeEditableInForm } from '../helpers';
import { ELEMENT_STYLES } from '../constants';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FieldParams } from '@/types/collections';

export type FieldValue<T extends FormEditableFieldType> = T extends PossibleFieldType.STRING
    ? string
    : T extends PossibleFieldType.NUMBER
    ? number
    : boolean;

interface FormFieldProps<T extends FormEditableFieldType> extends FieldParams {
    type: T;
    id: string;
    value?: FieldValue<T>;
    onChange: (newValue: FieldValue<T>) => void;
}

export default function FormField<T extends FormEditableFieldType>({
    type,
    id,
    title,
    description,
    disabled,
    prefix,
    postfix,
    value,
    onChange,
}: FormFieldProps<T>) {
    if (!isTypeEditableInForm(type) || !title || !onChange) {
        return null;
    }

    const onInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange && typeof onChange === 'function') {
            onChange(e.target.value as FieldValue<T>);
        }
    };

    const onInputNumberFieldChange = (newValue: number | null) => {
        if (onChange && typeof onChange === 'function') {
            onChange(newValue as FieldValue<T>);
        }
    };

    const onCheckboxFieldChange = (e: CheckboxChangeEvent) => {
        if (onChange && typeof onChange === 'function') {
            onChange(e.target.checked as FieldValue<T>);
        }
    };

    const renderPrefix = () => {
        if (!prefix) {
            return null;
        }

        if (typeof prefix === 'function') {
            return prefix();
        }

        return prefix;
    };

    const renderPostfix = () => {
        if (!postfix) {
            return null;
        }

        if (typeof postfix === 'function') {
            return postfix();
        }

        return postfix;
    };

    const renderFieldByType = () => {
        if (!isTypeEditableInForm(type)) {
            return null;
        }

        switch (type) {
            case PossibleFieldType.NUMBER:
                return (
                    <InputNumber
                        style={ELEMENT_STYLES.input}
                        id={id}
                        addonBefore={renderPrefix()}
                        addonAfter={renderPostfix()}
                        disabled={disabled}
                        placeholder={description}
                        value={Number(value)}
                        onChange={onInputNumberFieldChange}
                    />
                );
            case PossibleFieldType.BOOLEAN:
                return (
                    <Checkbox disabled={disabled} id={id} checked={Boolean(value)} onChange={onCheckboxFieldChange}>
                        {title}
                    </Checkbox>
                );
            default:
                return (
                    <Input
                        disabled={disabled}
                        id={id}
                        addonBefore={renderPrefix()}
                        addonAfter={renderPostfix()}
                        placeholder={description}
                        value={String(value)}
                        onChange={onInputFieldChange}
                    />
                );
        }
    };

    const renderHeader = () => {
        if (!title || type === PossibleFieldType.BOOLEAN) {
            return null;
        }

        return (
            <Row $stylesByBreakpoint={ELEMENT_STYLES.row}>
                <Column>
                    <Typography>{title}</Typography>
                </Column>
            </Row>
        );
    };

    return (
        <>
            {renderHeader()}
            <Row $stylesByBreakpoint={type === PossibleFieldType.BOOLEAN ? ELEMENT_STYLES.row : null}>
                <Column>{renderFieldByType()}</Column>
            </Row>
        </>
    );
}
