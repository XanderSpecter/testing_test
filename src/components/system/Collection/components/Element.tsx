'use client';

import React from 'react';
import { Typography, Button } from 'antd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { BaseObject, CollectionElement } from '@/types/apiModels';
import { Column, Row } from '@/components/base/Grid';
import { ColumnProps } from '@/components/base/Grid/Column';
import { AvailableCollection } from '@/types/collections';
import { COLS, ELEMENT_STYLES } from '../constants';
import { isFieldHiddenInTable } from '../helpers';
import { ObjectId } from 'mongodb';

interface ElementProps<T extends BaseObject> {
    fieldsMapping: AvailableCollection['fieldsMapping'];
    element: CollectionElement<T>;
    customMaxCols: ColumnProps['maxCols'];
    onEditClick: () => void;
    onDeleteClick: () => void;
    onEditorOpenClick: (_id?: ObjectId) => void;
}

export default function Element<T extends BaseObject = BaseObject>({
    fieldsMapping,
    customMaxCols,
    element,
    onEditClick,
    onDeleteClick,
    onEditorOpenClick,
}: ElementProps<T>) {
    if (!fieldsMapping) {
        return null;
    }

    const renderFields = () => {
        return Object.keys(fieldsMapping).map((key) => {
            const field = fieldsMapping[key];

            if (isFieldHiddenInTable(field)) {
                return null;
            }

            const { type } = field;

            let value: React.ReactNode = String(element[key]);

            if (type === 'object') {
                value = <Button onClick={() => onEditorOpenClick(element._id)}>Изменить в редакторе</Button>;
            }

            return (
                <Column
                    key={`${element._id}-${key}`}
                    cols={COLS.text}
                    maxCols={customMaxCols}
                    stylesByBreakpoint={ELEMENT_STYLES.column}
                >
                    <Typography>{value}</Typography>
                </Column>
            );
        });
    };

    return (
        <Row stylesByBreakpoint={ELEMENT_STYLES.tableRow}>
            {renderFields()}
            <Column cols={COLS.button} maxCols={customMaxCols} stylesByBreakpoint={ELEMENT_STYLES.buttonColumn}>
                <Button type="primary" onClick={onEditClick} icon={<EditFilled />} />
                <Button type="primary" danger onClick={onDeleteClick} icon={<DeleteFilled />} />
            </Column>
        </Row>
    );
}
