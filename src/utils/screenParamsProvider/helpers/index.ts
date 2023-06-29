import { Breakpoint } from '@/utils/breakpointsProvider';
import { DEFAULT_SCREEN_PARAMS, ScreenParams } from '../context';

export const calculateCurrentScreenParams = (breakpoints: Breakpoint[]): ScreenParams => {
    if (!window || typeof window === 'undefined') {
        return DEFAULT_SCREEN_PARAMS;
    }

    const clientWidth = window.innerWidth || 0;
    const clientHeight = window.innerHeight || 0;
    const scrollOffset = window.scrollY || 0;

    let shortcut = breakpoints[0].name;

    breakpoints.forEach((bp) => {
        if (clientWidth >= bp.screen) {
            shortcut = bp.name;
        }
    });

    return {
        width: clientWidth,
        height: clientHeight,
        breakpoint: shortcut,
        verticalScrollOffset: Math.round(scrollOffset),
    };
};
