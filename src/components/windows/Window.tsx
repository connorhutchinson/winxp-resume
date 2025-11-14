'use client';

import { useState, useRef, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import styles from './Window.module.scss';

export interface WindowProps {
    id: string;
    title: string;
    children: React.ReactNode;
    initialWidth?: number;
    initialHeight?: number;
    initialX?: number;
    initialY?: number;
    onClose?: () => void;
    onMinimize?: () => void;
    onMaximize?: () => void;
    onRestore?: () => void;
    onFocus?: () => void;
    isMinimized?: boolean;
    isMaximized?: boolean;
    zIndex?: number;
}

export default function Window({
    id,
    title,
    children,
    initialWidth = 600,
    initialHeight = 400,
    initialX = 100,
    initialY = 100,
    onClose,
    onMinimize,
    onMaximize,
    onRestore,
    onFocus,
    isMinimized = false,
    isMaximized = false,
    zIndex = 1000,
}: WindowProps) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
    const [isDragging, setIsDragging] = useState(false);
    const nodeRef = useRef(null);
    const savedSizeRef = useRef({ width: initialWidth, height: initialHeight });
    const savedPositionRef = useRef({ x: initialX, y: initialY });
    const prevMaximizedRef = useRef(isMaximized);
    const taskbarHeight = 40;

    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        if (isMaximized) return;

        // Constrain to viewport (accounting for taskbar)
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height - taskbarHeight;

        const constrainedX = Math.max(0, Math.min(data.x, maxX));
        const constrainedY = Math.max(0, Math.min(data.y, maxY));

        setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragStop = () => {
        setIsDragging(false);
    };

    const handleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        onMinimize?.();
    };

    const handleMaximize = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMaximized) {
            onRestore?.();
        } else {
            onMaximize?.();
        }
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose?.();
    };

    // Handle maximize/restore
    useEffect(() => {
        const wasMaximized = prevMaximizedRef.current;

        if (isMaximized && !wasMaximized) {
            // Transitioning to maximized: save current size and position
            savedSizeRef.current = { ...size };
            savedPositionRef.current = { ...position };
            // Maximize
            setSize({
                width: window.innerWidth,
                height: window.innerHeight - taskbarHeight,
            });
            setPosition({ x: 0, y: 0 });
        } else if (!isMaximized && wasMaximized) {
            // Transitioning from maximized: restore saved size and position
            setSize(savedSizeRef.current);
            setPosition(savedPositionRef.current);
        }

        prevMaximizedRef.current = isMaximized;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMaximized]);

    if (isMinimized) {
        return null;
    }

    const windowClasses = [
        styles.window,
        isMaximized ? styles.maximized : '',
        isMinimized ? styles.minimized : '',
    ].filter(Boolean).join(' ');

    return (
        <Draggable
            nodeRef={nodeRef}
            position={isMaximized ? { x: 0, y: 0 } : position}
            onDrag={handleDrag}
            onStart={handleDragStart}
            onStop={handleDragStop}
            handle=".window-title-bar"
            disabled={isMaximized}
        >
            <div
                ref={nodeRef}
                className={windowClasses}
                style={{
                    width: isMaximized ? '100vw' : `${size.width}px`,
                    height: isMaximized ? `calc(100vh - ${taskbarHeight}px)` : `${size.height}px`,
                    zIndex,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onFocus?.();
                }}
            >
                <div className={`${styles.titleBar} window-title-bar`}>
                    <span className={styles.title}>{title}</span>
                    <div className={styles.windowControls}>
                        <button
                            className={styles.controlButton}
                            onClick={handleMinimize}
                            aria-label="Minimize"
                        >
                            <img src="/images/minimize.svg" alt="Minimize" width={12} height={12} />
                        </button>
                        <button
                            className={styles.controlButton}
                            onClick={handleMaximize}
                            aria-label={isMaximized ? 'Restore' : 'Maximize'}
                        >
                            <img
                                src={isMaximized ? "/images/restore.svg" : "/images/maximize.svg"}
                                alt={isMaximized ? "Restore" : "Maximize"}
                                width={12}
                                height={12}
                            />
                        </button>
                        <button
                            className={`${styles.controlButton} ${styles.closeButton}`}
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <img src="/images/close.svg" alt="Close" width={12} height={12} />
                        </button>
                    </div>
                </div>
                <div className={styles.content}>{children}</div>
            </div>
        </Draggable>
    );
}

