import { BreakpointsContext } from '@/utils/breakpointsProvider';
import { DEFAULT_SCREEN_PARAMS, ScreenParams, ScreenParamsContext } from '@/utils/screenParamsProvider';
import { CSSProperties, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CONTROL_PANEL_WIDTH } from '../constants';

const DEFAULT_CANVAS_PARAMS: CSSProperties = {
    width: 1600,
    height: '100%',
};

const useCanvasResize = () => {
    const breakpoints = useContext(BreakpointsContext);
    const screenParams = useContext(ScreenParamsContext);

    const [mockScreenParams, setMockScreenParams] = useState<ScreenParams>(DEFAULT_SCREEN_PARAMS);
    const [canvasParams, setCanvasParams] = useState<CSSProperties | null>(DEFAULT_CANVAS_PARAMS);

    const canvasRef = useRef<HTMLDivElement>();
    const canvasParamsCalc = useRef<CSSProperties | null>();

    const widthLimit = useMemo(() => screenParams.width - CONTROL_PANEL_WIDTH, [screenParams]);

    const calcMockScreenParams = useCallback(() => {
        const width = canvasRef.current?.getBoundingClientRect().width;

        if (width) {
            let shortcut = breakpoints[0].name;
            const clientHeight = window.innerHeight || 0;

            breakpoints.forEach((bp) => {
                if (width >= bp.screen) {
                    shortcut = bp.name;
                }
            });

            setMockScreenParams({
                width,
                height: clientHeight,
                breakpoint: shortcut,
                verticalScrollOffset: 0,
            });
        }
    }, [breakpoints, canvasRef]);

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (canvasParamsCalc.current) {
                const currentParams = canvasParamsCalc.current;
                canvasParamsCalc.current = {
                    ...currentParams,
                    width: e.pageX <= widthLimit ? e.pageX : widthLimit,
                };

                setCanvasParams(canvasParamsCalc.current);

                calcMockScreenParams();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [breakpoints]
    );

    const onResizerMouseDown = () => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();

            canvasParamsCalc.current = {
                ...DEFAULT_CANVAS_PARAMS,
                width: Math.round(rect.width),
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
