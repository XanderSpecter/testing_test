import { ScreenParamsContext } from '@/utils/screenParamsProvider';
import { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { HEADER_HEIGHT } from '../../AdminLayout/constants';

const DEFAULT_ELEMENT_STYLE: CSSProperties = {
    width: 50,
    height: 50,
    top: 50,
    left: 50,
};

export interface UseDragNDropParams {
    style?: CSSProperties;
    onDrop?: (style: CSSProperties, screenShortcut: string) => void;
}

interface PositionParams {
    x: number;
    y: number;
}

interface PositionParamsStyles {
    top: number;
    left: number;
}

const useDragNDrop = ({ style, onDrop }: UseDragNDropParams) => {
    const screenParams = useContext(ScreenParamsContext);

    const [calculatedStyle, setCalculatedStyle] = useState<CSSProperties>(style || DEFAULT_ELEMENT_STYLE);

    const dndRef = useRef<HTMLDivElement>();
    const calcStyle = useRef<CSSProperties | null>();
    const cursorStartPosition = useRef<PositionParams>({
        x: 0,
        y: 0,
    });
    const startPosition = useRef<PositionParamsStyles>({
        top: 0,
        left: 0,
    });

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (dndRef.current && calcStyle.current && cursorStartPosition.current && startPosition.current) {
                const { x, y } = cursorStartPosition.current;

                const currentCursorX = e.pageX;
                const currentCursorY = e.pageY;

                const offsetCursorX = currentCursorX - x;
                const offsetCursorY = currentCursorY - y;

                const currentStyles = calcStyle.current;

                const { top, left } = startPosition.current;

                calcStyle.current = {
                    ...currentStyles,
                    top: top + offsetCursorY,
                    left: left + offsetCursorX,
                };

                setCalculatedStyle(calcStyle.current);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [screenParams]
    );

    const onDnDMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (dndRef.current) {
            const currentStyles = calcStyle.current || DEFAULT_ELEMENT_STYLE;
            const { top, left } = dndRef.current.getBoundingClientRect();

            cursorStartPosition.current = {
                x: e.pageX,
                y: e.pageY,
            };
            startPosition.current = {
                top: top - HEADER_HEIGHT,
                left,
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
