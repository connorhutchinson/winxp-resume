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
    const [isAnimatingMinimize, setIsAnimatingMinimize] = useState(false);
    const [isAnimatingRestore, setIsAnimatingRestore] = useState(false);
    const [shouldRender, setShouldRender] = useState(true);
    const nodeRef = useRef(null);
    const savedSizeRef = useRef({ width: initialWidth, height: initialHeight });
    const savedPositionRef = useRef({ x: initialX, y: initialY });
    const prevMaximizedRef = useRef(isMaximized);
    const prevMinimizedRef = useRef(isMinimized);
    const taskbarHeight = 40;
    const animationDuration = 120; // ms

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

    // Handle minimize/restore animation
    useEffect(() => {
        const wasMinimized = prevMinimizedRef.current;

        if (isMinimized && !wasMinimized) {
            // Starting minimize animation
            setIsAnimatingMinimize(true);
            setShouldRender(true);
            
            // Calculate taskbar button position (approximate center of taskbar area)
            // Taskbar buttons are typically in the middle-left area
            const taskbarButtonX = Math.max(100, Math.min(position.x, window.innerWidth - 200));
            const taskbarButtonY = window.innerHeight - taskbarHeight;

            // Save current position and size before animating
            savedPositionRef.current = { ...position };
            savedSizeRef.current = { ...size };

            // Animate to taskbar position (small size near bottom)
            setPosition({ 
                x: taskbarButtonX, 
                y: taskbarButtonY - 10 // Slightly above taskbar
            });
            setSize({ width: 1, height: 1 });

            // Hide after animation completes
            setTimeout(() => {
                setIsAnimatingMinimize(false);
                setShouldRender(false);
            }, animationDuration);
        } else if (!isMinimized && wasMinimized) {
            // Starting restore animation
            setIsAnimatingRestore(true);
            setShouldRender(true);

            // Start from taskbar position (small) - use similar calculation as minimize
            const savedX = savedPositionRef.current.x || initialX;
            const taskbarButtonX = Math.max(100, Math.min(savedX, window.innerWidth - 200));
            const taskbarButtonY = window.innerHeight - taskbarHeight;
            
            setPosition({ 
                x: taskbarButtonX, 
                y: taskbarButtonY - 10 
            });
            setSize({ width: 1, height: 1 });

            // After a brief moment, animate back to saved position
            setTimeout(() => {
                setPosition(savedPositionRef.current);
                setSize(savedSizeRef.current);
                
                // Clear animation state after animation completes
                setTimeout(() => {
                    setIsAnimatingRestore(false);
                }, animationDuration);
            }, 10);
        }

        prevMinimizedRef.current = isMinimized;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMinimized]);

    if (!shouldRender && !isAnimatingMinimize && !isAnimatingRestore) {
        return null;
    }

    const windowClasses = [
        styles.window,
        isMaximized ? styles.maximized : '',
        isAnimatingMinimize ? styles.minimizing : '',
        isAnimatingRestore ? styles.restoring : '',
        isDragging ? styles.dragging : '',
    ].filter(Boolean).join(' ');

    return (
        <Draggable
            nodeRef={nodeRef}
            position={isMaximized ? { x: 0, y: 0 } : position}
            onDrag={handleDrag}
            onStart={handleDragStart}
            onStop={handleDragStop}
            handle=".window-title-bar"
            disabled={isMaximized || isAnimatingMinimize || isAnimatingRestore}
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

