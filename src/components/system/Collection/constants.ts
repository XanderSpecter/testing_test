import { StylesByBreakpoint } from '@/types/HTMLElements';

const row: StylesByBreakpoint = { all: { marginTop: '16px' } };
const supportRow: StylesByBreakpoint = { all: { marginTop: '8px' } };
const tableRow: StylesByBreakpoint = {
    all: { paddingTop: '8px', paddingBottom: '8px', borderBottom: '1px solid grey' },
};
const buttonColumn: StylesByBreakpoint = { all: { display: 'flex', justifyContent: 'center', alignItems: 'center' } };
const column: StylesByBreakpoint = { all: { display: 'flex', alignItems: 'center' } };
const input = { width: '100%' };
const controlButton = { marginLeft: '16px' };
const formButton = { width: '100%' };

export const ELEMENT_STYLES = {
    row,
    supportRow,
    tableRow,
    buttonColumn,
    column,
    input,
    controlButton,
    formButton,
};
