import { throttle } from 'lodash';

import { BreakpointsContext } from '@/utils/breakpointsProvider';
import { DEFAULT_SCREEN_PARAMS, ScreenParams } from '@/utils/screenParamsProvider';
import { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { HEADER_HEIGHT } from '../../AdminLayout/constants';
import { RESIZER_SIZE } from '../constants';
import { MOUSEDOWN_LEFT_BUTTON } from '../../DragNDrop/constants';

const DEFAULT_CANVAS_PARAMS: CSSProperties = {
    width: 1600,
    height: '100%',
};

const SCREEN_PARAMS_UPDATE_DELAY = 300;

interface UseCanvasResizeParams {
    onBreakpointChange: (shortcut: string) => void;
    onCanvasClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const useCanvasResize = ({ onBreakpointChange, onCanvasClick }: UseCanvasResizeParams) => {
    const breakpoints = useContext(BreakpointsContext);

    const [mockScreenParams, setMockScreenParams] = useState<ScreenParams>(DEFAULT_SCREEN_PARAMS);
    const [canvasParams, setCanvasParams] = useState<CSSProperties | null>(DEFAULT_CANVAS_PARAMS);

    const canvasRef = useRef<HTMLDivElement>();
    const canvasParamsCalc = useRef<CSSProperties | null>();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const calcMockScreenParams = useCallback(
        throttle(() => {
            const width = canvasRef.current?.getBoundingClientRect().width;

            if (width) {
                let shortcut = breakpoints[0].name;
                const clientHeight = window.innerHeight || 0;

                const viewportWidth = width - RESIZER_SIZE;

                breakpoints.forEach((bp) => {
                    if (viewportWidth >= bp.screen) {
                        shortcut = bp.name;
                    }
                });

                setMockScreenParams({
                    width: width - RESIZER_SIZE,
                    height: clientHeight - HEADER_HEIGHT,
                    breakpoint: shortcut,
                    verticalScrollOffset: 0,
                });

                if (onBreakpointChange && typeof onBreakpointChange === 'function') {
                    onBreakpointChange(shortcut);
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, SCREEN_PARAMS_UPDATE_DELAY),
        [breakpoints, canvasRef]
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (canvasParamsCalc.current) {
                const currentParams = canvasParamsCalc.current;

                const width = e.pageX - RESIZER_SIZE;

                canvasParamsCalc.current = {
                    ...currentParams,
                    width: width,
                };

                setCanvasParams(canvasParamsCalc.current);

                calcMockScreenParams();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [breakpoints]
    );

    const onResizerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (onCanvasClick && typeof onCanvasClick === 'function') {
            onCanvasClick(e);
        }

        if (e.button !== MOUSEDOWN_LEFT_BUTTON) {
            return;
        }

        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();

            canvasParamsCalc.current = {
                ...DEFAULT_CANVAS_PARAMS,
                width: Math.round(rect.width - RESIZER_SIZE),
            };

            setCanvasParams(canvasParamsCalc.current);

            window.addEventListener('mousemove', onMouseMove);
        }
    };

    const onMouseUp = () => {
        const { width } = mockScreenParams;

        setCanvasParams({
            ...DEFAULT_CANVAS_PARAMS,
            width,
        });

        window.removeEventListener('mousemove', onMouseMove);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    useEffect(() => {
        calcMockScreenParams();

        window.addEventListener('resize', calcMockScreenParams);

        return () => window.removeEventListener('resize', calcMockScreenParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breakpoints]);

    return {
        mockScreenParams,
        canvasParams: canvasParams || canvasParamsCalc.current || {},
        onResizerMouseDown,
        onMouseUp,
        canvasRef,
    };
};

export default useCanvasResize;
