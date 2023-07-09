'use client';

import React, { useEffect, useState } from 'react';
import { Drawer, Button, Radio, Typography, RadioChangeEvent } from 'antd';
import { Column, Container, Row } from '@/components/base/Grid';
import { ElementType, PageBlock, StyledBlock, TextBlock } from '@/types/HTMLElements';
import { ELEMENT_STYLES } from '../../../Collection/constants';
import { PAGE_BLOCK_TYPES } from '@/constants/pageBlocks';
import { TYPE_CHANGE_WARNING } from './constants';
import { createEmptyPageBlock } from '../../helpers';
import TextForm from './components/TextFrom';
import BlockForm from './components/BlockForm';

interface FormProps {
    opened: boolean;
    parentId?: string | null;
    block: PageBlock | null;
    onSubmit: (block: PageBlock) => void;
    onCancel: () => void;
}

const { Text } = Typography;

export default function Form({ opened, block, parentId, onSubmit, onCancel }: FormProps) {
    const [editedBlock, setEditedBlock] = useState<PageBlock | null>(null);
    const [isTypeWarningShown, setIsTypeWarningShown] = useState(false);

    useEffect(() => {
        if (block) {
            setEditedBlock(block);
        } else {
            const newBlock = createEmptyPageBlock(ElementType.HTMLELEMENT, parentId);

            setEditedBlock(newBlock);
        }
    }, [block, parentId]);

    if (!editedBlock) {
        return null;
    }

    const onTypeChange = (e: RadioChangeEvent) => {
        if (!isTypeWarningShown) {
            setIsTypeWarningShown(true);

            return;
        }

        const type = e.target.value as ElementType;

        const newBlock = createEmptyPageBlock(type, parentId);

        setEditedBlock(newBlock);
        setIsTypeWarningShown(false);
    };

    const onTextBlockFieldChange = (fieldName: keyof TextBlock, newValue: string) => {
        const updated = { ...(editedBlock as TextBlock), [fieldName]: newValue };

        setEditedBlock(updated);
    };

    const onHTMLBlockFieldChange = (
        fieldName: keyof StyledBlock,
        newValue: string | StyledBlock['props'] | StyledBlock['stylesByBreakpoint']
    ) => {
        const updated = { ...(editedBlock as StyledBlock), [fieldName]: newValue };

        setEditedBlock(updated);
    };

    const renderTypeChangeWarning = () => {
        if (!isTypeWarningShown) {
            return null;
        }

        return (
            <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                <Column>
                    <Text type="danger">{TYPE_CHANGE_WARNING}</Text>
                </Column>
            </Row>
        );
    };

    const renderTypeSelector = () => {
        if (!editedBlock) {
            return null;
        }

        return (
            <>
                <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
                    <Column>
                        <Typography>Тип элемента</Typography>
                    </Column>
                </Row>
                <Row stylesByBreakpoint={ELEMENT_STYLES.supportRow}>
                    <Column>
                        <Radio.Group
                            options={PAGE_BLOCK_TYPES}
                            onChange={onTypeChange}
                            value={editedBlock.type}
                            optionType="button"
                            buttonStyle="solid"
                        />
                    </Column>
                </Row>
                {renderTypeChangeWarning()}
            </>
        );
    };

    const renderFormFields = () => {
        if (!editedBlock) {
            return null;
        }

        switch (editedBlock.type) {
            case ElementType.TEXT:
                return <TextForm block={editedBlock} onFieldChange={onTextBlockFieldChange} />;
            default:
                return <BlockForm block={editedBlock} onFieldChange={onHTMLBlockFieldChange} />;
        }
    };

    return (
        <Drawer
            open={opened}
            onClose={onCancel}
            width={700}
            destroyOnClose
            title={`${block ? 'Редактирование' : 'Добавление'} элемента`}
        >
            <form>
                <Container>
                    {renderTypeSelector()}
                    {renderFormFields()}
                    <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
                        <Column>
                            <Button type="primary" onClick={() => onSubmit(editedBlock || block)}>
                                Сохранить
                            </Button>
                        </Column>
                    </Row>
                </Container>
            </form>
        </Drawer>
    );
}
