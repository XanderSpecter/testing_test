import { ScreenParamsContext } from '@/utils/screenParamsProvider';
import { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BLOCK_POSITIONS_STATIC, MOUSEDOWN_LEFT_BUTTON } from './constants';
import { DnDResizerPosition } from './styled/DnDResizer';
import { BlockPosition, PositionVariant, WithBreakpointStyles } from '@/types/HTMLElements';
import {
    ChangableStyles,
    Coordinates,
    PositionStyles,
    calcCursorOffsets,
    filterOnlyDnDStyles,
    getStylesAfterMove,
    getStylesAfterResize,
} from './helpers';
import { HEADER_HEIGHT } from '../AdminLayout/constants';
import { mergeStyles } from '@/utils/styles/mergeStyles';

const DEFAULT_ELEMENT_STYLE = {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    top: 0,
    left: 0,
    right: 0,
    height: 0,
};

interface UseDragNDropParams {
    onDrop?: (style: CSSProperties, screenShortcut: string) => void;
}

export type DragNDropProps = WithBreakpointStyles<UseDragNDropParams>;

const useDragNDrop = ({ stylesByBreakpoint, onDrop }: DragNDropProps) => {
    const screenParams = useContext(ScreenParamsContext);

    const [calculatedStyle, setCalculatedStyle] = useState<CSSProperties>();

    const dndRef = useRef<HTMLDivElement>();
    const calcStyles = useRef<CSSProperties | null>();
    const cursorStartPosition = useRef<Coordinates>({
        x: 0,
        y: 0,
    });
    const startStyles = useRef<ChangableStyles>({
        ...DEFAULT_ELEMENT_STYLE,
        width: screenParams.width,
    });
    const resizerPos = useRef<DnDResizerPosition | null>(null);
    const blockPositioning = useRef<PositionVariant>(BlockPosition.ABSOLUTE);

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
                        calcStyles.current = {
                            ...currentStyles,
                            ...stylesAfterResize,
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
                    },
                    isStatic
                );

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
            const screenWidth = screenParams.width;

            const { top, left, width, height } = dndRef.current.getBoundingClientRect();
            const { position } = getComputedStyle(dndRef.current);

            const positionStyles: PositionStyles = {
                top: top - HEADER_HEIGHT,
                left,
                right: screenWidth - (left + width),
                marginTop: 0,
                marginLeft: 0,
                marginRight: 0,
            };

            if (!position || BLOCK_POSITIONS_STATIC.includes(position as BlockPosition)) {
                blockPositioning.current = BlockPosition.STATIC;

                const marginTop = currentStyles.marginTop;

                positionStyles.top = 0;
                positionStyles.left = 0;
                positionStyles.right = 0;
                positionStyles.marginTop = typeof marginTop === 'number' ? marginTop : 0;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    useEffect(() => {
        if (stylesByBreakpoint && screenParams?.breakpoint) {
            const currentStyles = mergeStyles(
                stylesByBreakpoint?.all || DEFAULT_ELEMENT_STYLE,
                stylesByBreakpoint[screenParams.breakpoint]
            );

            if (currentStyles && !currentStyles.width) {
                currentStyles.width = '100%';
            }

            if (
                currentStyles &&
                (!currentStyles.position || BLOCK_POSITIONS_STATIC.includes(currentStyles.position as BlockPosition))
            ) {
                blockPositioning.current = BlockPosition.STATIC;
                currentStyles.position = 'relative';
            }

            setCalculatedStyle(currentStyles);
            calcStyles.current = currentStyles;
        } else {
            blockPositioning.current = BlockPosition.STATIC;
            setCalculatedStyle({ width: '100%', height: 'auto', position: 'relative' });
        }
    }, [stylesByBreakpoint, screenParams]);

    return {
        dndRef,
        calculatedStyle: calculatedStyle,
        isStatic: blockPositioning.current === BlockPosition.STATIC,
        screenWidth: screenParams.width,
        onMouseUp,
        onDnDMouseDown,
    };
};

export default useDragNDrop;
