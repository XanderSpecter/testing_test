import { StylesByBreakpoint } from '@/types/HTMLElements';

export const COLS = {
    text: { all: 2 },
    button: { all: 1 },
    keyValueInput: { all: 5 },
};

const row: StylesByBreakpoint = { all: { marginTop: '16px' } };
const supportRow: StylesByBreakpoint = { all: { marginTop: '8px' } };
const tableRow: StylesByBreakpoint = {
    all: { paddingTop: '8px', paddingBottom: '8px', borderBottom: '1px solid grey' },
};
const buttonColumn: StylesByBreakpoint = { all: { justifyContent: 'center', alignItems: 'center' } };
const column: StylesByBreakpoint = { all: { alignItems: 'center' } };
const input = { width: '100%' };
const controlButton = { marginLeft: '16px' };

export const ELEMENT_STYLES = {
    row,
    supportRow,
    tableRow,
    buttonColumn,
    column,
    input,
    controlButton,
};
