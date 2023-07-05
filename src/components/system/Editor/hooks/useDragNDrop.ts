import { ScreenParamsContext } from '@/utils/screenParamsProvider';
import { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { HEADER_HEIGHT } from '../../AdminLayout/constants';
import { MOUSEDOWN_LEFT_BUTTON, RESIZER_WIDTH } from '../constants';
import { DnDResizerPosition } from '../styled/DnDResizer';

const DEFAULT_ELEMENT_STYLE = {
    width: 50,
    height: 50,
    top: 50,
    left: 50,
};

export interface UseDragNDropParams {
    style?: CSSProperties;
    onDrop?: (style: CSSProperties, screenShortcut: string) => void;
}

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

const useDragNDrop = ({ style, onDrop }: UseDragNDropParams) => {
    const screenParams = useContext(ScreenParamsContext);

    const [calculatedStyle, setCalculatedStyle] = useState<CSSProperties>(style || DEFAULT_ELEMENT_STYLE);

    const dndRef = useRef<HTMLDivElement>();
    const calcStyle = useRef<CSSProperties | null>();
    const cursorStartPosition = useRef<CoordinateParams>({
        x: 0,
        y: 0,
    });
    const startStyles = useRef<ChangableStyles>({
        ...DEFAULT_ELEMENT_STYLE,
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
            const currentStyles = calcStyle.current;

            if (currentStyles && offsets && startStyles.current) {
                if (resizerPos.current) {
                    const calculatedSizes = calcResize(offsets);

                    if (calculatedSizes) {
                        const { width, height, top, left } = calculatedSizes;

                        calcStyle.current = {
                            ...currentStyles,
                            top,
                            left,
                            width: width < 0 ? 0 : width,
                            height: height < 0 ? 0 : height,
                        };

                        setCalculatedStyle(calcStyle.current);
                    }

                    return;
                }

                const { x, y } = offsets;

                const { top, left } = startStyles.current;

                calcStyle.current = {
                    ...currentStyles,
                    top: top + y,
                    left: left + x,
                };

                setCalculatedStyle(calcStyle.current);
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
            const currentStyles = calcStyle.current || DEFAULT_ELEMENT_STYLE;
            const { top, left, width, height } = dndRef.current.getBoundingClientRect();

            console.log(width, height);

            cursorStartPosition.current = {
                x: e.pageX,
                y: e.pageY,
            };
            startStyles.current = {
                top: top - HEADER_HEIGHT,
                left,
                width: width - RESIZER_WIDTH * 2,
                height: height - RESIZER_WIDTH * 2,
            };
            calcStyle.current = {
                ...currentStyles,
            };

            setCalculatedStyle(calcStyle.current);

            window.addEventListener('mousemove', onMouseMove);
        }
    };

    const onMouseUp = () => {
        if (calcStyle.current) {
            setCalculatedStyle(calcStyle.current);

            if (onDrop) {
                onDrop(calcStyle.current, screenParams.breakpoint);
            }
        }

        resizerPos.current = null;

        window.removeEventListener('mousemove', onMouseMove);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    useEffect(() => {
        if (style) {
            setCalculatedStyle(style);
            calcStyle.current = style;
        }
    }, [style]);

    return {
        dndRef,
        calculatedStyle: calculatedStyle || calcStyle.current || {},
        onMouseUp,
        onDnDMouseDown,
    };
};

export default useDragNDrop;
