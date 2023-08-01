'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Typography, Button } from 'antd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';

import { BaseCollectionElementParams, CollectionElement, PossibleFieldType } from '@/types/apiModels';
import { Column, Row } from '@/components/base/Grid';
import { ColumnProps } from '@/components/base/Grid/Column';
import { AvailableCollection } from '@/types/collections';
import { ELEMENT_STYLES } from '../constants';
import { isFieldHiddenInTable } from '../helpers';

interface ElementProps<T extends BaseCollectionElementParams> {
    fieldsMapping: AvailableCollection['fieldsMapping'];
    element: CollectionElement<T>;
    customMaxCols: ColumnProps['maxCols'];
    onEditClick: () => void;
    onDeleteClick: () => void;
}

export default function Element<T extends BaseCollectionElementParams = BaseCollectionElementParams>({
    fieldsMapping,
    customMaxCols,
    element,
    onEditClick,
    onDeleteClick,
}: ElementProps<T>) {
    const router = useRouter();
    const pathname = usePathname();

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

            if (type === PossibleFieldType.EDITOR) {
                value = (
                    <Button
                        onClick={() =>
                            router.push(
                                `${pathname}/edit?id=${encodeURIComponent(
                                    String(element._id)
                                )}&field=${encodeURIComponent(key)}`
                            )
                        }
                    >
                        Изменить в редакторе
                    </Button>
                );
            }

            return (
                <Column
                    key={`${element._id}-${key}`}
                    cols={2}
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
            <Column cols={1} maxCols={customMaxCols} stylesByBreakpoint={ELEMENT_STYLES.buttonColumn}>
                <Button
                    style={ELEMENT_STYLES.controlButton}
                    type="primary"
                    onClick={onEditClick}
                    icon={<EditFilled />}
                />
                <Button
                    style={ELEMENT_STYLES.controlButton}
                    type="primary"
                    danger
                    onClick={onDeleteClick}
                    icon={<DeleteFilled />}
                />
            </Column>
        </Row>
    );
}
