'use client';

import React, { useEffect, useState } from 'react';
import { Button, Typography } from 'antd';
import { Column, Row } from '@/components/base/Grid';
import { BlockPropRecord, StyledBlock } from '@/types/HTMLElements';
import { ELEMENT_STYLES } from '../../../../Collection/constants';
import KeyValueField from './KeyValueField';

interface PropsFormProps {
    onFieldChange: (fieldName: 'props', newValue: StyledBlock['props']) => void;
    props: StyledBlock['props'];
    blockPath: StyledBlock['path'];
}

const { Text } = Typography;

export default function PropsForm({ blockPath, props, onFieldChange }: PropsFormProps) {
    const [editableProps, setEditableProps] = useState<BlockPropRecord[]>([]);
    const [isPropsChanged, setIsPropsChanged] = useState(false);

    useEffect(() => {
        setIsPropsChanged(false);

        if (props) {
            setEditableProps(Object.keys(props).map((k) => ({ key: k, value: props[k] })));
        } else {
            setEditableProps([]);
        }
    }, [props]);

    const onPropAdd = () => {
        setEditableProps([...editableProps, { key: '', value: '' }]);
    };

    const onPropDelete = (key: string, index: number) => {
        if (!editableProps) {
            return;
        }

        const updatedProps = editableProps.filter((p, i) => p.key !== key || i !== index);

        setEditableProps(updatedProps);
        setIsPropsChanged(updatedProps.length !== Object.keys(props || {}).length);
    };

    const onPropFieldChange = (index: number, field: keyof BlockPropRecord, newValue: string) => {
        if (!editableProps || !editableProps.length) {
            return;
        }

        const updatedProps = editableProps.map((p, i) => {
            if (i === index) {
                return { ...p, [field]: newValue };
            }

            return p;
        });

        setEditableProps(updatedProps);
        setIsPropsChanged(true);
    };

    const onPropsSave = () => {
        if (!editableProps || !onFieldChange || typeof onFieldChange !== 'function') {
            return;
        }

        const propsToSave: StyledBlock['props'] = {};

        editableProps.forEach((p) => {
            const { key, value } = p;

            if (!key || !value) {
                return;
            }

            propsToSave[key] = value;
        });

        onFieldChange('props', propsToSave);
    };

    const mapPropsInputs = () => {
        if (!editableProps) {
            return null;
        }

        return editableProps.map((p, i) => (
            <KeyValueField
                key={i}
                id={`${blockPath}-props-${p.key}`}
                keyField={p.key}
                valueField={p.value}
                onChange={(field, newValue) => onPropFieldChange(i, field, newValue)}
                onDelete={() => onPropDelete(p.key, i)}
            />
        ));
    };

    return (
        <>
            <Row>
                <Column>
                    <Text type="secondary">
                        Позволяет указать базовые параметры блока, такие как id, href и target для ссылок и некоторые
                        другие параметры, необходимые интерактивным блокам.
                    </Text>
                </Column>
            </Row>
            {mapPropsInputs()}
            <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                <Column cols={3} stylesByBreakpoint={ELEMENT_STYLES.buttonColumn}>
                    <Button style={ELEMENT_STYLES.formButton} onClick={onPropAdd}>
                        Добавить
                    </Button>
                </Column>
                <Column cols={3} stylesByBreakpoint={ELEMENT_STYLES.buttonColumn}>
                    <Button style={ELEMENT_STYLES.formButton} disabled={!isPropsChanged} onClick={onPropsSave}>
                        Сохранить
                    </Button>
                </Column>
            </Row>
        </>
    );
}
