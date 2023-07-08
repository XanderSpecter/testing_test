'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, Typography } from 'antd';
import { Column, Row } from '@/components/base/Grid';
import { BlockPropRecord, StyledBlock } from '@/types/HTMLElements';
import { COLS, ELEMENT_STYLES } from '../../../../Collection/constants';

interface PropsFormProps {
    onFieldChange: (fieldName: keyof StyledBlock['props'], newValue: StyledBlock['props']) => void;
    props: StyledBlock['props'];
    editorId: StyledBlock['editorId'];
}

const { Text } = Typography;

export default function PropsForm({ editorId, props, onFieldChange }: PropsFormProps) {
    const [editableProps, setEditableProps] = useState<BlockPropRecord[]>([]);
    const [isPropsChanged, setIsPropsChanged] = useState(false);

    const remappedProps = useMemo(() => {
        if (!props) {
            return [];
        }

        return Object.keys(props).map((k) => ({ key: k, value: props[k] }));
    }, [props]);

    useEffect(() => {
        if (remappedProps) {
            setEditableProps(remappedProps);
            setIsPropsChanged(false);
        }
    }, [remappedProps]);

    const onPropAdd = () => {
        setEditableProps([...editableProps, { key: '', value: '' }]);
    };

    const onPropFieldChange =
        (index: number, field: keyof BlockPropRecord) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const mapPropsInputs = () => {
        if (!editableProps) {
            return null;
        }

        return editableProps.map((p, i) => (
            <Row key={`${p.key}-${i}`} stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                <Column cols={COLS.keyValueInput}>
                    <Input
                        id={`${editorId}-props-${p.key}`}
                        placeholder="Ключ параметра"
                        value={p.key}
                        onChange={onPropFieldChange(i, 'key')}
                    />
                </Column>
                <Column cols={COLS.keyValueInput}>
                    <Input
                        id={`${editorId}-props-${p.value}-value`}
                        placeholder="Значение параметра"
                        value={String(p.value)}
                        onChange={onPropFieldChange(i, 'value')}
                    />
                </Column>
                <Column cols={COLS.text}>
                    <Button danger>Удалить</Button>
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
                    <Button disabled={!isPropsChanged}>Сохранить</Button>
                </Column>
            </Row>
        </>
    );
}
