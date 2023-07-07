import { StylesByBreakpoint } from '@/types/HTMLElements';

export const COLS = {
    text: { all: 2 },
    button: { all: 1 },
};

const row: StylesByBreakpoint = { all: { marginTop: '16px' } };
const supportRow: StylesByBreakpoint = { all: { marginTop: '8px' } };
const tableRow: StylesByBreakpoint = {
    all: { paddingTop: '8px', paddingBottom: '8px', borderBottom: '1px solid grey' },
};
const buttonColumn: StylesByBreakpoint = { all: { justifyContent: 'space-evenly', alignItems: 'center' } };
const column: StylesByBreakpoint = { all: { alignItems: 'center' } };

export const ELEMENT_STYLES = {
    row,
    supportRow,
    tableRow,
    buttonColumn,
    column,
};
