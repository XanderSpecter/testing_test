import { ScreenParamsContext } from '@/utils/screenParamsProvider';
import { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    BLOCK_POSITIONS_STATIC,
    DEFAULT_POSITION_STYLES,
    INLINE_BLOCK_DISPLAYS,
    MOUSEDOWN_LEFT_BUTTON,
} from './constants';
import { DnDResizerPosition } from './styled/DnDResizer';
import { BlockPosition, PositionVariant, WithBreakpointStyles } from '@/types/HTMLElements';
import {
    Coordinates,
    calcCursorOffsets,
    filterOnlyDnDStyles,
    getCurrentStyles,
    getStartStyles,
    getStylesAfterMove,
    getStylesAfterResize,
    recalcWidthAndOffsets,
} from './helpers';
import { mergeStyles } from '@/utils/styles/mergeStyles';
import { ChangableStyles } from './types';
import { BreakpointsContext } from '@/utils/breakpointsProvider';

interface UseDragNDropParams {
    onDrop?: (style: CSSProperties, screenShortcut: string) => void;
}

export type DragNDropProps = WithBreakpointStyles<UseDragNDropParams>;

const useDragNDrop = ({ stylesByBreakpoint, onDrop }: DragNDropProps) => {
    const screenParams = useContext(ScreenParamsContext);
    const breakpoints = useContext(BreakpointsContext);

    const [calculatedStyle, setCalculatedStyle] = useState<CSSProperties>({});

    const dndRef = useRef<HTMLDivElement>();
    const calcStyles = useRef<CSSProperties | null>();
    const cursorStartPosition = useRef<Coordinates>({
        x: 0,
        y: 0,
    });
    const startStyles = useRef<ChangableStyles>({
        ...DEFAULT_POSITION_STYLES,
        width: screenParams.width,
        height: 0,
    });
    const resizerPos = useRef<DnDResizerPosition | null>(null);
    const blockPositioning = useRef<PositionVariant>(BlockPosition.ABSOLUTE);
    const isMarginAutoDisabled = useRef(false);

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const offsets = calcCursorOffsets(e, cursorStartPosition.current);
            const currentStyles = calcStyles.current;

            const isStatic = blockPositioning.current === BlockPosition.STATIC;

            const { width: screenWidth } = screenParams;

            if (currentStyles && offsets && startStyles.current) {
                if (resizerPos.current) {
                    const stylesAfterResize = getStylesAfterResize(
                        {
                            offsets,
                            screenWidth,
                            startStyles: startStyles.current,
                            resizerPosition: resizerPos.current,
                        },
                        isStatic
                    );

                    if (stylesAfterResize) {
                        const { isHeightChanged } = stylesAfterResize;

                        calcStyles.current = {
                            ...currentStyles,
                            ...stylesAfterResize,
                            height: isHeightChanged ? stylesAfterResize.height : currentStyles.height,
                        };

                        setCalculatedStyle(calcStyles.current);
                    }

                    return;
                }

                const positionStyles = getStylesAfterMove(
                    {
                        offsets,
                        screenWidth,
                        startStyles: startStyles.current,
                        isMarginAutoDisabled: isMarginAutoDisabled.current,
                    },
                    isStatic
                );

                if (!positionStyles?.marginRight) {
                    delete currentStyles.marginRight;
                }

                if (positionStyles) {
                    calcStyles.current = {
                        ...currentStyles,
                        ...positionStyles,
                    };

                    setCalculatedStyle(calcStyles.current);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [screenParams]
    );

    const onMouseUp = useCallback((e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        if (calcStyles.current) {
            const isStatic = blockPositioning.current === BlockPosition.STATIC;
            const onlyDnDStyles = filterOnlyDnDStyles(calcStyles.current, isStatic);

            let completedStyles = onlyDnDStyles;

            if (stylesByBreakpoint && stylesByBreakpoint[screenParams.breakpoint]) {
                completedStyles = mergeStyles(stylesByBreakpoint[screenParams.breakpoint] || {}, onlyDnDStyles);
            }

            setCalculatedStyle(completedStyles);

            if (onDrop) {
                onDrop(completedStyles, screenParams.breakpoint);
            }
        }

        resizerPos.current = null;

        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDnDMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

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
            const isStatic = blockPositioning.current === BlockPosition.STATIC;
            const currentStyles = calcStyles.current || DEFAULT_POSITION_STYLES;
            const screenWidth = screenParams.width;

            const { width, height } = dndRef.current.getBoundingClientRect();

            const calculatedStartStyles = getStartStyles({ screenWidth, isStatic, width, height, currentStyles });

            if (calculatedStartStyles) {
                cursorStartPosition.current = {
                    x: e.pageX,
                    y: e.pageY,
                };

                startStyles.current = {
                    ...calculatedStartStyles,
                };

                calcStyles.current = {
                    ...currentStyles,
                };

                setCalculatedStyle(calcStyles.current);

                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const currentStyles = getCurrentStyles({ stylesByBreakpoint, breakpoints, shortcut: screenParams.breakpoint });

        if (!currentStyles.position || BLOCK_POSITIONS_STATIC.includes(currentStyles.position as BlockPosition)) {
            blockPositioning.current = BlockPosition.STATIC;
        }

        if (INLINE_BLOCK_DISPLAYS.includes(currentStyles.display)) {
            isMarginAutoDisabled.current = true;

            const { width, marginLeft, marginRight } = currentStyles;

            const { calculatedOffsetLeft, calculatedOffsetRight } = recalcWidthAndOffsets({
                width: width || screenParams.width,
                offsetLeft: marginLeft || 0,
                offsetRight: marginRight,
                screenWidth: screenParams.width,
            });

            currentStyles.marginLeft = calculatedOffsetLeft;
            currentStyles.marginRight = calculatedOffsetRight;
        }

        calcStyles.current = currentStyles;
        setCalculatedStyle(currentStyles);
    }, [stylesByBreakpoint, screenParams, breakpoints]);

    return {
        dndRef,
        calculatedStyle: calculatedStyle,
        isStatic: blockPositioning.current === BlockPosition.STATIC,
        screenWidth: screenParams.width,
        onDnDMouseDown,
    };
};

export default useDragNDrop;
