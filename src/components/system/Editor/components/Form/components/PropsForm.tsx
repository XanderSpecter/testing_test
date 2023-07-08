'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Typography } from 'antd';
import { Column, Row } from '@/components/base/Grid';
import { BlockPropRecord, StyledBlock } from '@/types/HTMLElements';
import { COLS, ELEMENT_STYLES } from '../../../../Collection/constants';

interface PropsFormProps {
    onFieldChange: (fieldName: 'props', newValue: StyledBlock['props']) => void;
    props: StyledBlock['props'];
    editorId: StyledBlock['editorId'];
}

const { Text } = Typography;

export default function PropsForm({ editorId, props, onFieldChange }: PropsFormProps) {
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

    const onPropFieldChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof BlockPropRecord) => {
        if (!editableProps || !editableProps.length) {
            return;
        }

        const updatedProps = editableProps.map((p, i) => {
            if (i === index) {
                return { ...p, [field]: e.target.value };
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
            <Row key={i} stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                <Column cols={COLS.keyValueInput}>
                    <Input
                        id={`${editorId}-props-${p.key}`}
                        placeholder="Ключ параметра"
                        value={p.key}
                        onChange={(e) => onPropFieldChange(e, i, 'key')}
                    />
                </Column>
                <Column cols={COLS.keyValueInput}>
                    <Input
                        id={`${editorId}-props-${p.value}-value`}
                        placeholder="Значение параметра"
                        value={String(p.value)}
                        onChange={(e) => onPropFieldChange(e, i, 'value')}
                    />
                </Column>
                <Column cols={COLS.text}>
                    <Button danger onClick={() => onPropDelete(p.key, i)}>
                        Удалить
                    </Button>
                </Column>
            </Row>
        ));
    };

    return (
        <>
            <Row>
                <Column>
                    <Text type="secondary">
                        Позволяет указать базовые параметры блока, такие как href для ссылок и некоторые другие
                        параметры, необходимые интерактивным блокам.
                    </Text>
                </Column>
            </Row>
            {mapPropsInputs()}
            <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                <Column cols={COLS.text} stylesByBreakpoint={ELEMENT_STYLES.buttonColumn}>
                    <Button onClick={onPropAdd}>Добавить</Button>
                </Column>
                <Column cols={COLS.text} stylesByBreakpoint={ELEMENT_STYLES.buttonColumn}>
                    <Button disabled={!isPropsChanged} onClick={onPropsSave}>
                        Сохранить
                    </Button>
                </Column>
            </Row>
        </>
    );
}
