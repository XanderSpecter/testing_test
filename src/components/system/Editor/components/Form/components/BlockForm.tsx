'use client';

import React from 'react';
import { Collapse, Select, Typography } from 'antd';
import { Column, Row } from '@/components/base/Grid';
import { ElementType, GridElement, HTMLTag, StyledBlock } from '@/types/HTMLElements';
import { ELEMENT_STYLES } from '../../../../Collection/constants';
import { AVAILABLE_TAGS_ITEMS } from '@/constants/pageBlocks';
import PropsForm from './PropsForm';
import StylesForm from './StylesForm';

interface BlockFormProps {
    onFieldChange: (
        fieldName: keyof StyledBlock,
        newValue: string | StyledBlock['props'] | StyledBlock['$stylesByBreakpoint']
    ) => void;
    block: StyledBlock | GridElement;
}

export default function BlockForm({ block, onFieldChange }: BlockFormProps) {
    const onSelect = (newValue: string) => {
        if (onFieldChange && typeof onFieldChange === 'function') {
            onFieldChange('tag', newValue);
        }
    };

    const filterOption = (
        input: string,
        option?: {
            label: HTMLTag;
            value: HTMLTag;
        }
    ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const renderTagSelector = () => {
        if (block.type === ElementType.CONTAINER || block.type === ElementType.ROW) {
            return null;
        }

        return (
            <>
                <Row $stylesByBreakpoint={ELEMENT_STYLES.row}>
                    <Column>
                        <Typography>HTML тег</Typography>
                    </Column>
                </Row>
                <Row $stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Select
                            id={`${block.path}-tag`}
                            style={ELEMENT_STYLES.input}
                            showSearch
                            optionFilterProp="tag"
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

    const formSections = [
        {
            key: 'props',
            label: 'Параметры блока',
            children: (
                <PropsForm props={block.props} blockPath={block.path} type={block.type} onFieldChange={onFieldChange} />
            ),
        },
        {
            key: 'styles',
            label: 'Стили блока',
            children: (
                <StylesForm
                    $stylesByBreakpoint={block.$stylesByBreakpoint}
                    blockPath={block.path}
                    type={block.type}
                    onFieldChange={onFieldChange}
                />
            ),
        },
    ];

    return (
        <>
            {renderTagSelector()}
            <Row $stylesByBreakpoint={ELEMENT_STYLES.row}>
                <Column>
                    <Collapse accordion items={formSections} />
                </Column>
            </Row>
        </>
    );
}
