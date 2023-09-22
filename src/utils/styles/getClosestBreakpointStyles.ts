import { StyleByBreakpoint, StylesByBreakpoint } from '@/types/HTMLElements';
import { Breakpoint } from '../breakpointsProvider';

interface GetClosestBreakpointStylesParams {
    $stylesByBreakpoint?: StylesByBreakpoint | null;
    breakpoints: Breakpoint[];
    shortcut: string;
}

const getClosestBreakpointStyles = ({
    $stylesByBreakpoint,
    breakpoints,
    shortcut,
}: GetClosestBreakpointStylesParams) => {
    if (!$stylesByBreakpoint) {
        return null;
    }

    const currentBreakpointScreenSize = breakpoints.find((b) => b.name === shortcut)?.screen;

    if (typeof currentBreakpointScreenSize !== 'number') {
        return null;
    }

    const lesserBreakpoints = breakpoints.filter((b) => b.screen <= currentBreakpointScreenSize);

    if (!lesserBreakpoints || !lesserBreakpoints.length) {
        return null;
    }

    let styles: StyleByBreakpoint = {};

    lesserBreakpoints.forEach((b) => {
        const { name } = b;

        if ($stylesByBreakpoint[name] && Object.keys($stylesByBreakpoint[name] || {}).length) {
            styles = $stylesByBreakpoint[name] || {};
        }
    });

    return styles;
};

export default getClosestBreakpointStyles;
