import { ScreenParamsContext } from '@/utils/screenParamsProvider';
import { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { HEADER_HEIGHT } from '../../AdminLayout/constants';
import { ACCURACY_TOLERANCE, BLOCK_POSITIONS_STATIC, MOUSEDOWN_LEFT_BUTTON } from '../constants';
import { DnDResizerPosition } from '../styled/DnDResizer';
import { BlockPosition, PositionVariant, WithBreakpointStyles } from '@/types/HTMLElements';
import { recalcWidthAndMargins } from '../helpers';

const DEFAULT_ELEMENT_STYLE = {
    width: 100,
    height: 50,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    top: 0,
    left: 0,
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
    marginTop: number;
    marginLeft: string | number;
    marginRight: string | number;
    width: string | number;
    height: number;
}

type PositionStyles = Omit<ChangableStyles, 'width' | 'height'>;

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
        ...DEFAULT_ELEMENT_STYLE,
    });
    const resizerPos = useRef<DnDResizerPosition | null>(null);
    const blockPositioning = useRef<PositionVariant>(BlockPosition.ABSOLUTE);

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

        const { width, height, top, left, marginLeft, marginTop } = startStyles.current;
        const { x, y } = offsets;

        const { width: screenWidth } = screenParams;

        const fullScreenWidth = screenParams.width - ACCURACY_TOLERANCE;

        const { calculatedWidth, calculatedMarginLeft, calculatedMarginRight } = recalcWidthAndMargins({
            width,
            marginLeft,
            screenWidth,
        });

        switch (resizerPos.current) {
            case DnDResizerPosition.BOTTOM:
                return {
                    marginTop,
                    marginLeft: calculatedMarginLeft,
                    marginRight: calculatedMarginRight,
                    top,
                    left,
                    width: calculatedWidth,
                    height: height + y,
                };
            case DnDResizerPosition.TOP:
                return {
                    marginTop: marginTop + y,
                    marginLeft: calculatedMarginLeft,
                    marginRight: calculatedMarginRight,
                    left,
                    top: top + y,
                    width: calculatedWidth,
                    height: height - y,
                };
            case DnDResizerPosition.RIGHT:
                return {
                    marginTop,
                    marginLeft: calculatedMarginLeft,
                    marginRight: calculatedMarginRight - x,
                    top,
                    left,
                    width: calculatedWidth + x >= fullScreenWidth ? '100%' : calculatedWidth + x,
                    height,
                };
            default:
                return {
                    marginTop,
                    marginLeft: calculatedMarginLeft + x,
                    marginRight: calculatedMarginRight,
                    top,
                    left: left + x,
                    width: calculatedWidth - x >= fullScreenWidth ? '100%' : calculatedWidth - x,
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

            const isStatic = blockPositioning.current === BlockPosition.STATIC;

            const { width: screenWidth } = screenParams;

            if (currentStyles && offsets && startStyles.current) {
                if (resizerPos.current) {
                    const calculatedSizes = calcResize(offsets);

                    if (calculatedSizes) {
                        const { width, height, top, left, marginLeft, marginRight, marginTop } = calculatedSizes;

                        const positionStyles: PositionStyles = {
                            top,
                            left,
                            marginTop: 0,
                            marginLeft: 0,
                            marginRight: 0,
                        };

                        if (isStatic && typeof marginLeft === 'number' && typeof marginRight === 'number') {
                            const calcMarginTop = marginTop < 0 ? 0 : marginTop;
                            const calcMarginLeft = marginLeft < 0 ? 0 : marginLeft;
                            const calcMarginRight = marginRight < 0 ? 0 : marginRight;

                            positionStyles.top = 0;
                            positionStyles.left = 0;
                            positionStyles.marginTop = calcMarginTop;
                            positionStyles.marginLeft = calcMarginLeft;
                            positionStyles.marginRight = calcMarginRight;
                        }

                        calcStyles.current = {
                            ...currentStyles,
                            ...positionStyles,
                            width: parseInt(String(width)) < 0 ? 0 : width,
                            height: height < 0 ? 0 : height,
                        };

                        setCalculatedStyle(calcStyles.current);
                    }

                    return;
                }

                const { x, y } = offsets;

                const { top, left, marginTop, marginLeft, width } = startStyles.current;

                const { calculatedWidth, calculatedMarginLeft } = recalcWidthAndMargins({
                    width,
                    marginLeft,
                    screenWidth,
                });

                const calculatedTop = top + y;
                const calculatedLeft = left + x;

                const positionStyles: PositionStyles = {
                    top: calculatedTop < 0 ? 0 : calculatedTop,
                    left: calculatedLeft < 0 ? 0 : calculatedLeft,
                    marginTop: 0,
                    marginLeft: 0,
                    marginRight: 0,
                };

                if (isStatic) {
                    const calcMarginTop = marginTop + y;
                    const calcMarginLeft = calculatedMarginLeft + x;
                    const calcMarginRight = screenWidth - (calcMarginLeft + calculatedWidth);

                    const renderedMarginTop = calcMarginTop < 0 ? 0 : calcMarginTop;
                    const renderedMarginLeft = calcMarginLeft < 0 ? 0 : calcMarginLeft;
                    const renderedMarginRight = calcMarginRight < 0 ? 0 : calcMarginRight;

                    const isMarginNotAuto =
                        calcMarginLeft < calcMarginRight - ACCURACY_TOLERANCE ||
                        calcMarginRight < calcMarginLeft - ACCURACY_TOLERANCE;

                    console.log(calcMarginLeft, calcMarginRight);

                    positionStyles.top = 0;
                    positionStyles.left = 0;
                    positionStyles.marginTop = renderedMarginTop;
                    positionStyles.marginLeft = isMarginNotAuto ? renderedMarginLeft : 'auto';
                    positionStyles.marginRight = isMarginNotAuto ? renderedMarginRight : 'auto';
                }

                calcStyles.current = {
                    ...currentStyles,
                    ...positionStyles,
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
            const { position } = dndRef.current.style;

            const positionStyles: PositionStyles = {
                top: top - HEADER_HEIGHT,
                left,
                marginTop: 0,
                marginLeft: 0,
                marginRight: 0,
            };

            if (!position || BLOCK_POSITIONS_STATIC.includes(position as BlockPosition)) {
                blockPositioning.current = BlockPosition.STATIC;

                positionStyles.top = 0;
                positionStyles.left = 0;
                positionStyles.marginTop = top - HEADER_HEIGHT;
                positionStyles.marginLeft = left;
                positionStyles.marginRight = screenParams.width - (left + width);
            }

            cursorStartPosition.current = {
                x: e.pageX,
                y: e.pageY,
            };

            startStyles.current = {
                ...positionStyles,
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
                currentStyles.width = '100%';
            }

            if (currentStyles && !currentStyles.position) {
                currentStyles.position = 'relative';
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
