'use client';

import React, { CSSProperties, useContext, useEffect, useMemo, useState } from 'react';
import { get } from 'lodash';
import { Button, Input, Select, Typography } from 'antd';
import { Column, Row } from '@/components/base/Grid';
import { BlockStyleRecord, StyleType, StyledBlock } from '@/types/HTMLElements';
import { COLS, ELEMENT_STYLES } from '../../../../Collection/constants';
import { BreakpointsContext } from '@/utils/breakpointsProvider';
import { STYLE_TYPES } from '@/constants/pageBlocks';

interface StylesFormProps {
    onFieldChange: (fieldName: 'stylesByBreakpoint', newValue: StyledBlock['stylesByBreakpoint']) => void;
    stylesByBreakpoint: StyledBlock['stylesByBreakpoint'];
    editorId: StyledBlock['editorId'];
}

const { Text } = Typography;

export default function StylesForm({ editorId, stylesByBreakpoint, onFieldChange }: StylesFormProps) {
    const breakpoints = useContext(BreakpointsContext);

    const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('all');
    const [currentStyleType, setCurrentStyleType] = useState<StyleType>(StyleType.BASE);
    const [isStylesChanged, setIsStylesChanged] = useState(false);
    const [currentStyleSet, setCurrentStyleSet] = useState<BlockStyleRecord[]>([]);

    const breakpointItems = useMemo(() => {
        const items = breakpoints.map((b) => ({ label: b.name, value: b.name }));
        items.unshift({ label: 'Все разрешения', value: 'all' });

        return items;
    }, [breakpoints]);

    const onBreakpointSelect = (newValue: string) => {
        setCurrentBreakpoint(newValue);
        setIsStylesChanged(false);
    };

    const onStyleTypeSelect = (newValue: string) => {
        setCurrentStyleType(newValue as StyleType);
        setIsStylesChanged(false);
    };

    const path = useMemo(
        () => `${currentBreakpoint}${currentStyleType ? `.${currentStyleType}` : ''}`,
        [currentBreakpoint, currentStyleType]
    );
    const styleSet = useMemo(() => get(stylesByBreakpoint, path), [stylesByBreakpoint, path]);

    useEffect(() => {
        if (styleSet) {
            setCurrentStyleSet(
                Object.keys(styleSet).map((k) => ({
                    key: k as keyof CSSProperties,
                    value: styleSet[k as keyof CSSProperties],
                }))
            );
        } else {
            setCurrentStyleSet([]);
        }
    }, [styleSet]);

    const onStyleSetSave = () => {
        if (!currentStyleSet || !onFieldChange || typeof onFieldChange !== 'function') {
            return;
        }

        const stylesToSave: Record<string, unknown> = {};

        currentStyleSet.forEach((s) => {
            const { key, value } = s;

            if (!key || !value) {
                return;
            }

            stylesToSave[key] = value;
        });

        const existedStyles = stylesByBreakpoint?.[currentBreakpoint] || {};

        const updatedStyles = {
            ...stylesByBreakpoint,
            [currentBreakpoint]: currentStyleType
                ? { ...existedStyles, [currentStyleType]: { ...stylesToSave } }
                : { ...stylesToSave },
        };

        onFieldChange('stylesByBreakpoint', updatedStyles);
    };

    const onStyleAdd = () => {
        setCurrentStyleSet([...currentStyleSet, { key: '' as keyof CSSProperties, value: '' }]);
    };

    const onStyleDelete = (key: string, index: number) => {
        if (!currentStyleSet) {
            return;
        }

        const updatedProps = currentStyleSet.filter((s, i) => s.key !== key || i !== index);

        setCurrentStyleSet(updatedProps);
        setIsStylesChanged(updatedProps.length !== Object.keys(styleSet || {}).length);
    };

    const onPropFieldChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
        field: keyof BlockStyleRecord
    ) => {
        if (!currentStyleSet || !currentStyleSet.length) {
            return;
        }

        const updatedProps = currentStyleSet.map((s, i) => {
            if (i === index) {
                return { ...s, [field]: e.target.value };
            }

            return s;
        });

        setCurrentStyleSet(updatedProps);
        setIsStylesChanged(true);
    };

    const renderBreakpointSelect = () => {
        if (!breakpointItems || !breakpointItems.length) {
            return null;
        }

        return (
            <>
                <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
                    <Column>
                        <Typography>Контрольная точка размера экрана</Typography>
                    </Column>
                </Row>
                <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Text type="secondary">
                            Добавленные стили будут применяться только к выбранному разрешению экрана. Если стили для
                            более высокого разрешения не отличаются от предыдущих или от базовых, они не будут
                            применяться, даже если указаны.
                        </Text>
                    </Column>
                </Row>
                <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Select
                            id={`${editorId}-styles-breakpoint`}
                            style={ELEMENT_STYLES.input}
                            onChange={onBreakpointSelect}
                            value={currentBreakpoint}
                            options={breakpointItems}
                        />
                    </Column>
                </Row>
            </>
        );
    };

    const renderStyleTypeSelect = () => {
        return (
            <>
                <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
                    <Column>
                        <Typography>Тип стилей</Typography>
                    </Column>
                </Row>
                <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Text type="secondary">
                            Позволяет выбрать состояние элемента, для которого будут применены стили.
                        </Text>
                    </Column>
                </Row>
                <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Select
                            id={`${editorId}-styles-styletype`}
                            style={ELEMENT_STYLES.input}
                            onChange={onStyleTypeSelect}
                            value={currentStyleType}
                            options={STYLE_TYPES}
                        />
                    </Column>
                </Row>
            </>
        );
    };

    const mapStyleInputs = () => {
        if (!currentStyleSet) {
            return null;
        }

        return currentStyleSet.map((s, i) => {
            if (s.key === StyleType.HOVER || s.key === StyleType.FOCUS) {
                return null;
            }

            return (
                <Row key={i} stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column cols={COLS.keyValueInput}>
                        <Input
                            id={`${editorId}-styles-${currentBreakpoint}-${currentStyleType}-${s.key}`}
                            placeholder="Название стиля"
                            value={s.key}
                            onChange={(e) => onPropFieldChange(e, i, 'key')}
                        />
                    </Column>
                    <Column cols={COLS.keyValueInput}>
                        <Input
                            id={`${editorId}-styles-${currentBreakpoint}-${currentStyleType}-${s.value}-value`}
                            placeholder="Значение стиля"
                            value={String(s.value)}
                            onChange={(e) => onPropFieldChange(e, i, 'value')}
                        />
                    </Column>
                    <Column cols={COLS.text}>
                        <Button danger onClick={() => onStyleDelete(s.key, i)}>
                            Удалить
                        </Button>
                    </Column>
                </Row>
            );
        });
    };

    return (
        <>
            <Row>
                <Column>
                    <Text type="secondary">
                        Позволяет указать стили блока для каждой из контрольных точек размера экрана, а также базовые
                        стили, которые применяются для всех разрешений. Если базовые стили подразумевают использование
                        размеров, рекомендуется указывать размеры для минимального экрана и далее перекрывать их для
                        более высоких разрешений.
                    </Text>
                </Column>
            </Row>
            {renderBreakpointSelect()}
            {renderStyleTypeSelect()}
            {mapStyleInputs()}
            <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                <Column cols={COLS.text} stylesByBreakpoint={ELEMENT_STYLES.buttonColumn}>
                    <Button onClick={onStyleAdd}>Добавить</Button>
                </Column>
                <Column cols={COLS.text} stylesByBreakpoint={ELEMENT_STYLES.buttonColumn}>
                    <Button disabled={!isStylesChanged} onClick={onStyleSetSave}>
                        Сохранить
                    </Button>
                </Column>
            </Row>
        </>
    );
}
