'use client';

import { Typography } from 'antd';
import { BaseObject, CollectionElement } from '@/types/apiModels';
import { Column, Row } from '@/components/base/Grid';
import { ColumnProps } from '@/components/base/Grid/Column';
import { COLS, ELEMENT_STYLES } from '..';

interface ElementProps<T extends BaseObject> {
    fieldsMappingKeys: string[];
    element: CollectionElement<T>;
    customMaxCols: ColumnProps['maxCols'];
}

export default function Element<T extends BaseObject = BaseObject>({
    fieldsMappingKeys,
    customMaxCols,
    element,
}: ElementProps<T>) {
    if (!fieldsMappingKeys || !fieldsMappingKeys.length) {
        return null;
    }

    const renderFields = () => {
        return fieldsMappingKeys.map((key) => {
            const value = element[key];

            return (
                <Column key={`${element._id}-${key}`} cols={COLS} maxCols={customMaxCols}>
                    <Typography>{String(value)}</Typography>
                </Column>
            );
        });
    };

    return <Row stylesByBreakpoint={ELEMENT_STYLES.row}>{renderFields()}</Row>;
}
