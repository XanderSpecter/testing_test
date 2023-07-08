'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Collapse, Input, Select, Typography } from 'antd';
import { Column, Row } from '@/components/base/Grid';
import { BlockPropRecord, StyledBlock } from '@/types/HTMLElements';
import { COLS, ELEMENT_STYLES } from '../../../../Collection/constants';
import { AVAILABLE_TAGS_ITEMS } from '@/constants/pageBlocks';
import PropsForm from './PropsForm';

interface BlockFormProps {
    onFieldChange: (fieldName: keyof StyledBlock, newValue: string) => void;
    block: StyledBlock;
}

const { Text } = Typography;

export default function BlockForm({ block, onFieldChange }: BlockFormProps) {
    const onSelect = (newValue: string) => {
        if (onFieldChange && typeof onFieldChange === 'function') {
            onFieldChange('tag', newValue);
        }
    };

    const onInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onFieldChange && typeof onFieldChange === 'function') {
            onFieldChange('content', e.target.value);
        }
    };

    const filterOption = (
        input: string,
        option?: {
            label: keyof HTMLElementTagNameMap;
            value: keyof HTMLElementTagNameMap;
        }
    ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const renderTagSelector = () => {
        return (
            <>
                <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
                    <Column>
                        <Typography>HTML тег</Typography>
                    </Column>
                </Row>
                <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Select
                            id={`${block.editorId}-tag`}
                            style={ELEMENT_STYLES.input}
                            showSearch
                            placeholder="Select a person"
                            optionFilterProp="children"
                            onChange={onSelect}
                            value={block.tag}
                            filterOption={filterOption}
                            options={AVAILABLE_TAGS_ITEMS}
                        />
                    </Column>
                </Row>
            </>
        );
    };

    const renderBaseContentInput = () => {
        return (
            <>
                <Row>
                    <Column>
                        <Text type="secondary">
                            Позволяет указать в качестве содержимого простой текст. Подходит для текстовых блоков или
                            ссылок. В иных случаях, необходимо добавлять дочерние блоки (в разработке)
                        </Text>
                    </Column>
                </Row>
                <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Input
                            id={`${block.editorId}-content`}
                            placeholder="Здесь могла быть ваша реклама"
                            value={block.content}
                            onChange={onInputFieldChange}
                        />
                    </Column>
                </Row>
            </>
        );
    };

    const formSections = [
        {
            key: 'content',
            label: 'Базовое содержимое блока',
            children: renderBaseContentInput(),
        },
        {
            key: 'props',
            label: 'Параметры блока',
            children: (
                <PropsForm
                    props={block.props}
                    editorId={block.editorId}
                    onFieldChange={(_, newProps) => console.log(newProps)}
                />
            ),
        },
    ];

    console.log('render');

    return (
        <>
            {renderTagSelector()}
            <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
                <Column>
                    <Collapse accordion items={formSections} />
                </Column>
            </Row>
        </>
    );
}
