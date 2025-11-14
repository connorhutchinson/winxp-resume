'use client';

import { useState } from 'react';
import DesktopIcon from './DesktopIcon';
import styles from './Desktop.module.scss';
import Taskbar from './Taskbar';
import Window from './Window';
import ChatWindow from './ChatWindow';

export interface WindowState {
    id: string;
    title: string;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
}

export default function Desktop() {
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [maxZIndex, setMaxZIndex] = useState(1000);

    const desktopIcons = [
        { id: 'chat', label: 'Chat with my resume', imageUrl: '/images/pdf.svg' },
        { id: 'resume', label: 'Resume.pdf', imageUrl: '/images/pdf.svg' },
        { id: 'contact', label: 'Contact Me', imageUrl: '/images/pdf.svg' },
    ];

    const handleIconClick = (iconId: string) => {
        setSelectedIcon(iconId);
    };

    const handleDesktopClick = () => {
        setSelectedIcon(null);
    };

    const handleIconDoubleClick = (iconId: string) => {
        // Check if window already exists
        const existingWindow = windows.find(w => w.id === iconId);
        if (existingWindow) {
            // Bring to front and restore if minimized
            bringWindowToFront(iconId);
            if (existingWindow.isMinimized) {
                setWindows(windows.map(w =>
                    w.id === iconId ? { ...w, isMinimized: false } : w
                ));
            }
        } else {
            // Create new window
            const icon = desktopIcons.find(i => i.id === iconId);
            if (icon) {
                setWindows([...windows, {
                    id: iconId,
                    title: icon.label,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: maxZIndex + 1,
                }]);
                setMaxZIndex(maxZIndex + 1);
            }
        }
    };

    const bringWindowToFront = (windowId: string) => {
        const newZIndex = maxZIndex + 1;
        setWindows(windows.map(w =>
            w.id === windowId ? { ...w, zIndex: newZIndex } : w
        ));
        setMaxZIndex(newZIndex);
    };

    const handleTaskbarButtonClick = (windowId: string) => {
        setWindows(prevWindows => {
            const window = prevWindows.find(w => w.id === windowId);
            if (!window) return prevWindows;

            // Calculate new zIndex from current windows
            const currentMaxZIndex = Math.max(...prevWindows.map(w => w.zIndex), maxZIndex);
            const newZIndex = currentMaxZIndex + 1;
            setMaxZIndex(newZIndex);

            return prevWindows.map(w => {
                if (w.id === windowId) {
                    return {
                        ...w,
                        isMinimized: false, // Always restore if minimized
                        zIndex: newZIndex, // Bring to front
                    };
                }
                return w;
            });
        });
    };

    // Get the active window (highest zIndex that's not minimized)
    const getActiveWindowId = () => {
        const visibleWindows = windows.filter(w => !w.isMinimized);
        if (visibleWindows.length === 0) return null;
        return visibleWindows.reduce((prev, curr) =>
            curr.zIndex > prev.zIndex ? curr : prev
        ).id;
    };

    const handleWindowClose = (windowId: string) => {
        setWindows(windows.filter(w => w.id !== windowId));
    };

    const handleWindowMinimize = (windowId: string) => {
        setWindows(windows.map(w =>
            w.id === windowId ? { ...w, isMinimized: true } : w
        ));
    };

    const handleWindowMaximize = (windowId: string) => {
        setWindows(windows.map(w =>
            w.id === windowId ? { ...w, isMaximized: true } : w
        ));
    };

    const handleWindowRestore = (windowId: string) => {
        setWindows(windows.map(w =>
            w.id === windowId ? { ...w, isMaximized: false } : w
        ));
    };

    const getWindowContent = (windowId: string) => {
        switch (windowId) {
            case 'chat':
                return <ChatWindow />;
            case 'resume':
                return (
                    <div style={{ padding: '20px' }}>
                        <h2 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
                            Resume.pdf
                        </h2>
                        <p style={{ fontSize: '11px', lineHeight: '1.5' }}>
                            Resume content would go here...
                        </p>
                    </div>
                );
            case 'contact':
                return (
                    <div style={{ padding: '20px' }}>
                        <h2 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
                            Contact Me
                        </h2>
                        <p style={{ fontSize: '11px', lineHeight: '1.5' }}>
                            Contact information would go here...
                        </p>
                    </div>
                );
            default:
                return <div>Window content</div>;
        }
    };

    return (
        <div
            className={styles.desktop}
            onClick={handleDesktopClick}
        >
            <div className={styles.iconsContainer}>
                {desktopIcons.map((icon) => (
                    <DesktopIcon
                        key={icon.id}
                        id={icon.id}
                        label={icon.label}
                        imageUrl={icon.imageUrl}
                        isSelected={selectedIcon === icon.id}
                        onClick={handleIconClick}
                        onDoubleClick={handleIconDoubleClick}
                    />
                ))}
            </div>

            {windows.map((window) => (
                <Window
                    key={window.id}
                    id={window.id}
                    title={window.title}
                    isMinimized={window.isMinimized}
                    isMaximized={window.isMaximized}
                    zIndex={window.zIndex}
                    onClose={() => handleWindowClose(window.id)}
                    onMinimize={() => handleWindowMinimize(window.id)}
                    onMaximize={() => handleWindowMaximize(window.id)}
                    onRestore={() => handleWindowRestore(window.id)}
                    onFocus={() => bringWindowToFront(window.id)}
                    initialX={100 + windows.indexOf(window) * 30}
                    initialY={100 + windows.indexOf(window) * 30}
                    initialWidth={window.id === 'chat' ? 500 : undefined}
                    initialHeight={window.id === 'chat' ? 400 : undefined}
                >
                    {getWindowContent(window.id)}
                </Window>
            ))}

            <Taskbar
                windows={windows}
                activeWindowId={getActiveWindowId()}
                onTaskbarButtonClick={handleTaskbarButtonClick}
                desktopIcons={desktopIcons}
                onIconDoubleClick={handleIconDoubleClick}
            />
        </div>
    );
}