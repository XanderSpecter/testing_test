'use client';

import React, { useEffect, useState } from 'react';
import { Drawer, Button } from 'antd';
import { CollectionElement, FormEditableFieldType } from '@/types/apiModels';
import { AvailableCollection } from '@/types/collections';
import { createEmptyElement } from '../helpers';
import FormField, { FieldValue } from './FormField';
import { Column, Container, Row } from '@/components/base/Grid';
import { ELEMENT_STYLES } from '../constants';

interface FormProps {
    opened: boolean;
    fieldsMapping?: AvailableCollection['fieldsMapping'];
    element?: Partial<CollectionElement> | null;
    onSubmit: (element: Partial<CollectionElement>) => void;
    onCancel: () => void;
}

export default function Form({ fieldsMapping, opened, element, onSubmit, onCancel }: FormProps) {
    const [editedElement, setEditedElement] = useState<Partial<CollectionElement> | null>();

    useEffect(() => {
        if (opened) {
            if (element) {
                setEditedElement(element);
            } else {
                const newElement = createEmptyElement(fieldsMapping);

                setEditedElement(newElement);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [element, opened]);

    const onFieldChange = (fieldName: string, newValue?: string | number | boolean) => {
        setEditedElement({
            ...editedElement,
            [fieldName]: newValue,
        });
    };

    const renderForm = () => {
        if (!editedElement || !fieldsMapping) {
            return null;
        }

        return Object.keys(editedElement).map((key) => {
            const fieldParams = fieldsMapping[key];

            if (!fieldParams) {
                return null;
            }

            const { title, type, disabled, description } = fieldParams;

            return (
                <FormField
                    key={key}
                    title={title}
                    description={description}
                    type={type as FormEditableFieldType}
                    id={key}
                    disabled={disabled}
                    onChange={(newValue) => onFieldChange(key, newValue)}
                    value={editedElement[key] as FieldValue<Exclude<typeof type, 'object' | 'array'>>}
                />
            );
        });
    };

    if (!fieldsMapping || !editedElement) {
        return null;
    }

    return (
        <Drawer open={opened} onClose={onCancel} title="">
            <form>
                <Container>
                    {renderForm()}
                    <Row stylesByBreakpoint={ELEMENT_STYLES.row}>
                        <Column>
                            <Button type="primary" onClick={() => onSubmit(editedElement)}>
                                Сохранить
                            </Button>
                        </Column>
                    </Row>
                </Container>
            </form>
        </Drawer>
    );
}
