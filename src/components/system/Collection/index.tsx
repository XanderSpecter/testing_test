'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import FullScreenLoader from '@/components/base/FullScreenLoader';
import { useElements } from '@/hooks/api/useElements';

import { Button, Typography } from 'antd';
import { BaseObject, CollectionParams, CollectionElement } from '@/types/apiModels';
import { Column, Container, Row } from '@/components/base/Grid';
import Element from './components/Element';
import { ELEMENT_STYLES } from './constants';
import { getCollectionParams } from '@/utils/collections';
import Form from './components/Form';
import { isFieldHiddenInTable } from './helpers';
import { HeaderContentContext } from '../AdminLayout';

interface CollectionProps extends CollectionParams {
    query: BaseObject;
}

const { Title } = Typography;

export default function Collection({ collectionElementName, query }: CollectionProps) {
    const setHeaderContent = useContext(HeaderContentContext);

    const { elementsList, isLoading, createElement, updateElement, removeElement, refetchElementsList } = useElements({
        collectionElementName,
        query,
    });

    const [isFormOpened, setIsFormOpened] = useState(false);
    const [selectedElement, setSelectedElement] = useState<CollectionElement | null>(null);

    const currentCollection = useMemo(() => getCollectionParams(collectionElementName), [collectionElementName]);
    const fieldsMapping = useMemo(() => currentCollection?.fieldsMapping || {}, [currentCollection]);
    const quantity = useMemo(() => {
        let q = 0;

        Object.values(fieldsMapping).forEach((v) => {
            if (!isFieldHiddenInTable(v)) {
                q += 1;
            }
        });

        return q;
    }, [fieldsMapping]);
    const customMaxCols = useMemo(() => ({ all: quantity * 2 + 1 }), [quantity]);

    useEffect(() => {
        refetchElementsList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = (element: Partial<CollectionElement>) => {
        setIsFormOpened(false);

        if (selectedElement) {
            updateElement({ ...element, _id: selectedElement._id });
            setSelectedElement(null);

            return;
        }

        createElement(element);
    };

    const renderHeaders = () => {
        if (!quantity) {
            return null;
        }

        return Object.keys(fieldsMapping).map((key) => {
            const field = fieldsMapping[key];

            if (isFieldHiddenInTable(field)) {
                return null;
            }

            const { title } = field;

            return (
                <Column
                    key={`headers-${key}`}
                    cols={2}
                    maxCols={customMaxCols}
                    $stylesByBreakpoint={ELEMENT_STYLES.column}
                >
                    <Title level={5}>{title}</Title>
                </Column>
            );
        });
    };

    const renderElements = () => {
        if (!elementsList || !elementsList.length) {
            return (
                <Row $stylesByBreakpoint={ELEMENT_STYLES.tableRow}>
                    <Column>
                        <Typography>Здесь ничего нет</Typography>
                    </Column>
                </Row>
            );
        }

        return elementsList.map((e) => (
            <Element
                key={String(e._id)}
                element={e}
                customMaxCols={customMaxCols}
                fieldsMapping={fieldsMapping}
                onEditClick={() => {
                    setSelectedElement(e);
                    setIsFormOpened(true);
                }}
                onDeleteClick={() => removeElement(e._id)}
            />
        ));
    };

    useEffect(() => {
        if (setHeaderContent) {
            setHeaderContent(
                <Button type="primary" onClick={() => setIsFormOpened(true)}>
                    Добавить
                </Button>
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHeaderContent]);

    if (!quantity) {
        return null;
    }

    return (
        <Container>
            <FullScreenLoader show={isLoading} />
            <Row $stylesByBreakpoint={ELEMENT_STYLES.row}>
                <Column $stylesByBreakpoint={ELEMENT_STYLES.column}>
                    <Title>{currentCollection?.title}</Title>
                </Column>
            </Row>
            <Row $stylesByBreakpoint={ELEMENT_STYLES.tableRow}>
                {renderHeaders()}
                <Column cols={1} maxCols={customMaxCols} />
            </Row>
            {renderElements()}
            <Form
                opened={isFormOpened}
                fieldsMapping={currentCollection?.fieldsMapping}
                element={selectedElement}
                onSubmit={onSubmit}
                onCancel={() => {
                    if (selectedElement) {
                        setSelectedElement(null);
                    }

                    setIsFormOpened(false);
                }}
            />
        </Container>
    );
}
