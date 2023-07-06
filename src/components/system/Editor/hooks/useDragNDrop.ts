import { ScreenParamsContext } from '@/utils/screenParamsProvider';
import { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { HEADER_HEIGHT } from '../../AdminLayout/constants';
import { MOUSEDOWN_LEFT_BUTTON } from '../constants';
import { DnDResizerPosition } from '../styled/DnDResizer';
import { WithBreakpointStyles } from '@/types/HTMLElements';

const DEFAULT_ELEMENT_STYLE: CSSProperties = {
    position: 'absolute',
    width: 50,
    height: 50,
    top: 50,
    left: 50,
};

const DEFAULT_COORDINATES = {
    width: 50,
    height: 50,
    top: 50,
    left: 50,
};

interface UseDragNDropParams {
    onDrop?: (style: CSSProperties, screenShortcut: string) => void;
}

export type DragNDropProps = WithBreakpointStyles<UseDragNDropParams>;

interface CoordinateParams {
    x: number;
    y: number;
}

interface ChangableStyles {
    top: number;
    left: number;
    width: number;
    height: number;
}

const useDragNDrop = ({ stylesByBreakpoint, onDrop }: DragNDropProps) => {
    const screenParams = useContext(ScreenParamsContext);

    const [calculatedStyle, setCalculatedStyle] = useState<CSSProperties>();

    const dndRef = useRef<HTMLDivElement>();
    const calcStyles = useRef<CSSProperties | null>();
    const cursorStartPosition = useRef<CoordinateParams>({
        x: 0,
        y: 0,
    });
    const startStyles = useRef<ChangableStyles>({
        ...DEFAULT_COORDINATES,
    });
    const resizerPos = useRef<DnDResizerPosition | null>(null);

    const calcCursorOffsets = (e: MouseEvent): CoordinateParams | null => {
        if (!e || !cursorStartPosition.current) {
            return null;
        }

        const { x, y } = cursorStartPosition.current;
        const { pageX, pageY } = e;

        return {
            x: pageX - x,
            y: pageY - y,
        };
    };

    const calcResize = (offsets: CoordinateParams): ChangableStyles | null => {
        if (!offsets || !startStyles.current || !resizerPos.current) {
            return null;
        }

        const { width, height, top, left } = startStyles.current;
        const { x, y } = offsets;

        switch (resizerPos.current) {
            case DnDResizerPosition.BOTTOM:
                return {
                    top,
                    left,
                    width,
                    height: height + y,
                };
            case DnDResizerPosition.TOP:
                return {
                    left,
                    top: top + y,
                    width,
                    height: height - y,
                };
            case DnDResizerPosition.RIGHT:
                return {
                    top,
                    left,
                    width: width + x,
                    height,
                };
            default:
                return {
                    top,
                    left: left + x,
                    width: width - x,
                    height,
                };
        }
    };

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const offsets = calcCursorOffsets(e);
            const currentStyles = calcStyles.current;

            if (currentStyles && offsets && startStyles.current) {
                if (resizerPos.current) {
                    const calculatedSizes = calcResize(offsets);

                    if (calculatedSizes) {
                        const { width, height, top, left } = calculatedSizes;

                        calcStyles.current = {
                            ...currentStyles,
                            top,
                            left,
                            width: width < 0 ? 0 : width,
                            height: height < 0 ? 0 : height,
                        };

                        setCalculatedStyle(calcStyles.current);
                    }

                    return;
                }

                const { x, y } = offsets;

                const { top, left } = startStyles.current;

                const calculatedTop = top + y;
                const calculatedLeft = left + x;

                calcStyles.current = {
                    ...currentStyles,
                    top: calculatedTop < 0 ? 0 : calculatedTop,
                    left: calculatedLeft < 0 ? 0 : calculatedLeft,
                };

                setCalculatedStyle(calcStyles.current);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [screenParams]
    );

    const onDnDMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== MOUSEDOWN_LEFT_BUTTON) {
            return;
        }

        if ((e.target as HTMLDivElement).dataset) {
            const { pos } = (e.target as HTMLDivElement).dataset;

            if (pos) {
                resizerPos.current = pos as DnDResizerPosition;
            }
        }

        if (dndRef.current) {
            const currentStyles = calcStyles.current || DEFAULT_ELEMENT_STYLE;
            const { top, left, width, height } = dndRef.current.getBoundingClientRect();

            cursorStartPosition.current = {
                x: e.pageX,
                y: e.pageY,
            };
            startStyles.current = {
                top: top - HEADER_HEIGHT,
                left,
                width: width,
                height: height,
            };
            calcStyles.current = {
                ...currentStyles,
            };

            setCalculatedStyle(calcStyles.current);

            window.addEventListener('mousemove', onMouseMove);
        }
    };

    const onMouseUp = () => {
        if (calcStyles.current) {
            setCalculatedStyle(calcStyles.current);

            if (onDrop) {
                onDrop(calcStyles.current, screenParams.breakpoint);
            }
        }

        resizerPos.current = null;

        window.removeEventListener('mousemove', onMouseMove);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    useEffect(() => {
        if (stylesByBreakpoint && screenParams?.breakpoint) {
            const currentStyles = stylesByBreakpoint[screenParams.breakpoint] || stylesByBreakpoint?.all;

            if (currentStyles && !currentStyles.width) {
                currentStyles.width = screenParams.width;
            }

            if (currentStyles && !currentStyles.position) {
                currentStyles.position = 'absolute';
            }

            setCalculatedStyle(currentStyles || DEFAULT_ELEMENT_STYLE);
            calcStyles.current = currentStyles;
        }
    }, [stylesByBreakpoint, screenParams]);

    return {
        dndRef,
        calculatedStyle: calculatedStyle,
        onMouseUp,
        onDnDMouseDown,
    };
};

export default useDragNDrop;
