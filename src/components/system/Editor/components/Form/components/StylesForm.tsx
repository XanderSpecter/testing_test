'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { get } from 'lodash';
import { Button, Select, Typography } from 'antd';
import { Column, Row } from '@/components/base/Grid';
import { BlockStyleRecord, CSSPropertyKey, ElementType, StyleType, StyledBlock } from '@/types/HTMLElements';
import { ELEMENT_STYLES } from '../../../../Collection/constants';
import { BreakpointsContext } from '@/utils/breakpointsProvider';
import { STYLE_TYPES } from '@/constants/pageBlocks';
import KeyValueField from './KeyValueField';
import { getObjectFromLocalStorage, saveObjectToLocalStorage } from '@/utils/localStorage';

interface StylesFormProps {
    onFieldChange: (fieldName: '$stylesByBreakpoint', newValue: StyledBlock['$stylesByBreakpoint']) => void;
    $stylesByBreakpoint: StyledBlock['$stylesByBreakpoint'];
    blockPath: StyledBlock['path'];
    type: ElementType.HTMLELEMENT | ElementType.CONTAINER | ElementType.ROW;
}

const { Text } = Typography;

export default function StylesForm({ blockPath, type, $stylesByBreakpoint, onFieldChange }: StylesFormProps) {
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
    const styleSet = useMemo(() => get($stylesByBreakpoint, path), [$stylesByBreakpoint, path]);

    useEffect(() => {
        if (styleSet) {
            setCurrentStyleSet(
                Object.keys(styleSet).map((k) => ({
                    key: k as CSSPropertyKey,
                    value: styleSet[k as CSSPropertyKey],
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

        const existedStyles = $stylesByBreakpoint?.[currentBreakpoint] || {};

        const updatedStyles = {
            ...$stylesByBreakpoint,
            [currentBreakpoint]: currentStyleType
                ? { ...existedStyles, [currentStyleType]: { ...stylesToSave } }
                : { ...stylesToSave },
        };

        onFieldChange('$stylesByBreakpoint', updatedStyles);
    };

    const onStyleAdd = () => {
        setCurrentStyleSet([...currentStyleSet, { key: '' as CSSPropertyKey, value: '' }]);
    };

    const onStyleDelete = (key: string, index: number) => {
        if (!currentStyleSet) {
            return;
        }

        const updatedProps = currentStyleSet.filter((s, i) => s.key !== key || i !== index);

        setCurrentStyleSet(updatedProps);
        setIsStylesChanged(updatedProps.length !== Object.keys(styleSet || {}).length);
    };

    const onPropFieldChange = (index: number, field: keyof BlockStyleRecord, newValue: string) => {
        if (!currentStyleSet || !currentStyleSet.length) {
            return;
        }

        const updatedProps = currentStyleSet.map((s, i) => {
            if (i === index) {
                return { ...s, [field]: newValue };
            }

            return s;
        });

        setCurrentStyleSet(updatedProps);
        setIsStylesChanged(true);
    };

    const onStylesCopy = () => {
        if (!currentStyleSet || !currentStyleSet.length) {
            return;
        }

        saveObjectToLocalStorage('blockStyles', currentStyleSet);
    };

    const onStylesPaste = () => {
        const savedStyleSet = getObjectFromLocalStorage<BlockStyleRecord[]>('blockStyles');

        if (!savedStyleSet) {
            return;
        }

        setCurrentStyleSet(savedStyleSet);
        setIsStylesChanged(true);
    };

    const renderBreakpointSelect = () => {
        if (!breakpointItems || !breakpointItems.length) {
            return null;
        }

        return (
            <>
                <Row $stylesByBreakpoint={ELEMENT_STYLES.row}>
                    <Column>
                        <Typography>Контрольная точка размера экрана</Typography>
                    </Column>
                </Row>
                <Row $stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Text type="secondary">
                            Добавленные стили будут применяться только к выбранному разрешению экрана. Если стили для
                            более высокого разрешения не отличаются от предыдущих или от базовых, они не будут
                            применяться, даже если указаны.
                        </Text>
                    </Column>
                </Row>
                <Row $stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Select
                            id={`${blockPath}-styles-breakpoint`}
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
                <Row $stylesByBreakpoint={ELEMENT_STYLES.row}>
                    <Column>
                        <Typography>Тип стилей</Typography>
                    </Column>
                </Row>
                <Row $stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Text type="secondary">
                            Позволяет выбрать состояние элемента, для которого будут применены стили.
                        </Text>
                    </Column>
                </Row>
                <Row $stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Select
                            id={`${blockPath}-styles-styletype`}
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
                <KeyValueField
                    key={i}
                    id={`${blockPath}-styles-${currentBreakpoint}-${currentStyleType}-${s.key}`}
                    keyField={s.key}
                    valueField={s.value}
                    onChange={(field, newValue) => onPropFieldChange(i, field, newValue)}
                    onDelete={() => onStyleDelete(s.key, i)}
                />
            );
        });
    };

    const renderCopyPasteButton = () => {
        if (!currentStyleSet || !currentStyleSet.length) {
            return (
                <Button style={ELEMENT_STYLES.formButton} onClick={onStylesPaste}>
                    Вставить стили
                </Button>
            );
        }

        return (
            <Button style={ELEMENT_STYLES.formButton} onClick={onStylesCopy}>
                Скопировать стили
            </Button>
        );
    };

    const renderFormMessage = () => {
        if (type === ElementType.CONTAINER) {
            return (
                <Text type="secondary">
                    Контейнер сетки имеет ряд стандартных стилей, которые не подлежат редактированию. Очень много других
                    стилей настраиваются, однако, важно понимать, что изменение некоторых стилей может привести к
                    печальным последствиям.
                </Text>
            );
        }

        return (
            <Text type="secondary">
                Позволяет указать стили блока для каждой из контрольных точек размера экрана, а также базовые стили,
                которые применяются для всех разрешений. Если базовые стили подразумевают использование размеров,
                рекомендуется указывать размеры для минимального экрана и далее перекрывать их для более высоких
                разрешений.
            </Text>
        );
    };

    return (
        <>
            <Row>
                <Column>{renderFormMessage()}</Column>
            </Row>
            {renderBreakpointSelect()}
            {renderStyleTypeSelect()}
            {mapStyleInputs()}
            <Row $stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                <Column cols={3} $stylesByBreakpoint={ELEMENT_STYLES.buttonColumn}>
                    <Button style={ELEMENT_STYLES.formButton} onClick={onStyleAdd}>
                        Добавить
                    </Button>
                </Column>
                <Column cols={3} $stylesByBreakpoint={ELEMENT_STYLES.buttonColumn}>
                    <Button style={ELEMENT_STYLES.formButton} disabled={!isStylesChanged} onClick={onStyleSetSave}>
                        Сохранить
                    </Button>
                </Column>
                <Column cols={4} $stylesByBreakpoint={ELEMENT_STYLES.buttonColumn}>
                    {renderCopyPasteButton()}
                </Column>
            </Row>
        </>
    );
}
