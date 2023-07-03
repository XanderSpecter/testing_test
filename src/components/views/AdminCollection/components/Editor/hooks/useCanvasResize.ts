import { BreakpointsContext } from '@/utils/breakpointsProvider';
import { DEFAULT_SCREEN_PARAMS, ScreenParams, ScreenParamsContext } from '@/utils/screenParamsProvider';
import { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BorderProps } from '../styled/Border';

const DEFAULT_CANVAS_PARAMS: CSSProperties = {
    width: 1600,
    height: '100%',
    position: 'relative',
};

const useCanvasResize = () => {
    const breakpoints = useContext(BreakpointsContext);
    const screenParams = useContext(ScreenParamsContext);

    const [mockScreenParams, setMockScreenParams] = useState<ScreenParams>(DEFAULT_SCREEN_PARAMS);
    const [canvasParams, setCanvasParams] = useState<CSSProperties | null>(DEFAULT_CANVAS_PARAMS);

    const canvasRef = useRef<HTMLDivElement>();

    const selectedBorder = useRef<BorderProps['position']>();
    const canvasParamsCalc = useRef<CSSProperties | null>();

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

                if (selectedBorder.current === 'left') {
                    canvasParamsCalc.current = {
                        ...currentParams,
                        left: Math.round(e.pageX),
                    };

                    setCanvasParams(canvasParamsCalc.current);
                }

                if (selectedBorder.current === 'right') {
                    canvasParamsCalc.current = {
                        ...currentParams,
                        right: Math.round(screenParams.width - e.pageX),
                    };

                    setCanvasParams(canvasParamsCalc.current);
                }

                calcMockScreenParams();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [breakpoints]
    );

    const onBorderMouseDown = (e: React.MouseEvent<HTMLDivElement>, position: BorderProps['position']) => {
        selectedBorder.current = position;

        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();

            canvasParamsCalc.current = {
                ...DEFAULT_CANVAS_PARAMS,
                position: 'absolute',
                width: 'auto',
                left: Math.round(rect.left),
                right: Math.round(screenParams.width - rect.right),
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
        onBorderMouseDown,
        onMouseUp,
        canvasRef,
    };
};

export default useCanvasResize;
