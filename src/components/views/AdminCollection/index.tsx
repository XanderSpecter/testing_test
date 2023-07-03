'use client';

import React, { useMemo, useState } from 'react';
import FullScreenLoader from '@/components/base/FullScreenLoader';
import { useElements } from '@/hooks/api/useElements';

import { Button, Typography } from 'antd';
import { BaseObject, Collection, CollectionElement } from '@/types/apiModels';
import { Column, Container, Row } from '@/components/base/Grid';
import Element from './components/Element';
import { COLS, ELEMENT_STYLES } from './constants';
import { getCollectionParams } from '@/utils/collections';
import Form from './components/Form';
import { isFieldHiddenInTable } from './helpers';

interface AdminCollectionProps extends Collection {
    query: BaseObject;
}

const { Title } = Typography;

export default function AdminCollection({ collectionElementName, query }: AdminCollectionProps) {
    const { elementsList, isLoading, createElement, updateElement, removeElement } = useElements({
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

    const onSubmit = (element: Partial<CollectionElement>) => {
        setIsFormOpened(false);

        if (selectedElement) {
            updateElement({ _id: selectedElement._id, ...element });
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
                <Column key={`headers-${key}`} cols={COLS.text} maxCols={customMaxCols}>
                    <Title level={5}>{title}</Title>
                </Column>
            );
        });
    };

    const renderElements = () => {
        if (!elementsList || !elementsList.length) {
            return (
                <Row stylesByBreakpoint={ELEMENT_STYLES.tableRow}>
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
                onEditorOpenClick={(_id) => console.log(_id)}
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
                    <Button type="primary" onClick={() => setIsFormOpened(true)}>
                        Добавить
                    </Button>
                </Column>
            </Row>
            <Row stylesByBreakpoint={ELEMENT_STYLES.tableRow}>
                {renderHeaders()}
                <Column cols={COLS.button} maxCols={customMaxCols} />
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
