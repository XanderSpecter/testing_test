'use client';

import React, { useEffect, useState } from 'react';
import { Drawer, Button, Radio, Typography, RadioChangeEvent } from 'antd';
import { Column, Container, Row } from '@/components/base/Grid';
import { ElementType, PageBlock } from '@/types/HTMLElements';
import { ELEMENT_STYLES } from '../../../Collection/constants';
import { PAGE_BLOCK_TYPES } from '@/constants/pageBlocks';
import { TYPE_CHANGE_WARNING } from './constants';
import { createEmptyPageBlock } from '../../helpers';

interface FormProps {
    opened: boolean;
    block?: PageBlock | null;
    onSubmit: (block: PageBlock) => void;
    onCancel: () => void;
}

const { Text } = Typography;

export default function Form({ opened, block, onSubmit, onCancel }: FormProps) {
    const [editedBlock, setEditedBlock] = useState<PageBlock | null>(null);
    const [isTypeWarningShown, setIsTypeWarningShown] = useState(false);

    useEffect(() => {
        if (block) {
            setEditedBlock(block);
        } else {
            const newBlock = createEmptyPageBlock(ElementType.HTMLELEMENT);

            setEditedBlock(newBlock);
        }
    }, [block]);

    if (!editedBlock) {
        return null;
    }

    const onTypeChange = (e: RadioChangeEvent) => {
        if (!isTypeWarningShown) {
            setIsTypeWarningShown(true);

            return;
        }

        const type = e.target.value as ElementType;

        const newBlock = createEmptyPageBlock(type);

        setEditedBlock(newBlock);
        setIsTypeWarningShown(false);
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
                <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
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
