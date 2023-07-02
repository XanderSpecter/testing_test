'use client';

import { Typography, Button } from 'antd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { BaseObject, CollectionElement } from '@/types/apiModels';
import { Column, Row } from '@/components/base/Grid';
import { ColumnProps } from '@/components/base/Grid/Column';
import { COLS, ELEMENT_STYLES } from '..';

interface ElementProps<T extends BaseObject> {
    fieldsMappingKeys: string[];
    element: CollectionElement<T>;
    customMaxCols: ColumnProps['maxCols'];
    onEditClick: () => void;
    onDeleteClick: () => void;
}

export default function Element<T extends BaseObject = BaseObject>({
    fieldsMappingKeys,
    customMaxCols,
    element,
    onEditClick,
    onDeleteClick,
}: ElementProps<T>) {
    if (!fieldsMappingKeys || !fieldsMappingKeys.length) {
        return null;
    }

    const renderFields = () => {
        return fieldsMappingKeys.map((key) => {
            const value = element[key];

            return (
                <Column
                    key={`${element._id}-${key}`}
                    cols={COLS.text}
                    maxCols={customMaxCols}
                    stylesByBreakpoint={ELEMENT_STYLES.column}
                >
                    <Typography>{String(value)}</Typography>
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
