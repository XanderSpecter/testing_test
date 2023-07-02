'use client';

import { useMemo } from 'react';
import FullScreenLoader from '@/components/base/FullScreenLoader';
import { useElements } from '@/hooks/api/useElements';

import { Button, Typography } from 'antd';
import { BaseObject, Collection } from '@/types/apiModels';
import { AVAILABLE_COLLECTIONS } from '@/constants/collections';
import { Column, Container, Row } from '@/components/base/Grid';
import Element from './components/Element';

interface AdminCollectionProps extends Collection {
    query: BaseObject;
}

const { Title } = Typography;

export const COLS = { all: 3 };
export const ELEMENT_STYLES = {
    row: { all: { marginTop: '16px' } },
};

export default function AdminCollection({ collectionElementName, query }: AdminCollectionProps) {
    const { elementsList, isLoading, createElement, updateElement, removeElement } = useElements({
        collectionElementName,
        query,
    });

    const currentCollection = useMemo(
        () => AVAILABLE_COLLECTIONS.find((c) => c.name === collectionElementName),
        [collectionElementName]
    );

    const fieldsMappingKeys = Object.keys(currentCollection?.fieldsMapping || []);
    const quantity = fieldsMappingKeys.length;

    const customMaxCols = useMemo(() => ({ all: quantity * 3 + 2 }), [quantity]);

    const renderHeaders = () => {
        if (!quantity) {
            return null;
        }

        return fieldsMappingKeys.map((key) => {
            const header = currentCollection?.fieldsMapping?.[key]?.shortcut;

            if (!header) {
                return null;
            }

            return (
                <Column key={`headers-${key}`} cols={COLS} maxCols={customMaxCols}>
                    <Title level={5}>{header}</Title>
                </Column>
            );
        });
    };

    const renderElements = () => {
        if (!elementsList || !elementsList.length) {
            return (
                <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
                    <Column>
                        <Title level={5}>Здесь ничего нет</Title>
                    </Column>
                </Row>
            );
        }

        return elementsList.map((e) => (
            <Element
                key={String(e._id)}
                element={e}
                customMaxCols={customMaxCols}
                fieldsMappingKeys={fieldsMappingKeys}
            />
        ));
    };

    if (!quantity) {
        return null;
    }

    return (
        <Container>
            <FullScreenLoader show={isLoading} />
            <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
                <Column>
                    <Title>{currentCollection?.title}</Title>
                </Column>
            </Row>
            <Row>
                <Column>
                    <Button onClick={() => createElement({})}>Добавить</Button>
                </Column>
            </Row>
            <Row stylesByBreakpoint={ELEMENT_STYLES.row}>{renderHeaders()}</Row>
            {renderElements()}
        </Container>
    );
}
