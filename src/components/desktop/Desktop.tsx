'use client';

import { useState, useEffect } from 'react';
import DesktopIcon from './DesktopIcon';
import styles from './Desktop.module.scss';
import Taskbar from './Taskbar';
import Window from '../windows/Window';
import ChatWindow from '../windows/ChatWindow';
import WelcomeWindow from '../windows/WelcomeWindow';
import SettingsWindow from '../windows/SettingsWindow';
import BSOD from '../windows/BSOD';

export interface WindowState {
    id: string;
    title: string;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
}

const WELCOME_WINDOW_ID = 'welcome';
const SETTINGS_WINDOW_ID = 'settings';
const WELCOME_CLOSED_KEY = 'welcomeWindowClosed';
const DESKTOP_BACKGROUND_KEY = 'desktopBackground';

export default function Desktop() {
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [maxZIndex, setMaxZIndex] = useState(1000);
    const [desktopBackground, setDesktopBackground] = useState<string>('/images/background.jpeg');
    const [loadedBackground, setLoadedBackground] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [showBSOD, setShowBSOD] = useState(false);
    const [bsodType, setBsodType] = useState<'shutdown' | 'restart'>('shutdown');

    // Progressive image loading: preload the full image and swap when ready
    useEffect(() => {
        const backgroundToLoad = desktopBackground.startsWith('#') ? null : desktopBackground;

        if (backgroundToLoad) {
            setIsImageLoading(true);
            // Preload the full-quality image
            const img = new Image();
            img.onload = () => {
                // Small delay to ensure smooth transition
                setTimeout(() => {
                    setLoadedBackground(backgroundToLoad);
                    setIsImageLoading(false);
                }, 100);
            };
            img.onerror = () => {
                setIsImageLoading(false);
            };
            // Start loading the full image
            img.src = backgroundToLoad;
        } else {
            // For solid colors, no loading needed
            setLoadedBackground(null);
            setIsImageLoading(false);
        }
    }, [desktopBackground]);

    // Check if welcome window should be shown on mount and load saved background
    useEffect(() => {
        // Load saved background
        const savedBackground = localStorage.getItem(DESKTOP_BACKGROUND_KEY);
        if (savedBackground) {
            setDesktopBackground(savedBackground);
        }

        // Show welcome window if not closed before
        const welcomeClosed = localStorage.getItem(WELCOME_CLOSED_KEY);
        if (!welcomeClosed && typeof window !== 'undefined') {
            // Show welcome window centered on screen
            setWindows([{
                id: WELCOME_WINDOW_ID,
                title: 'Welcome!',
                isMinimized: false,
                isMaximized: false,
                zIndex: maxZIndex + 1,
            }]);
            setMaxZIndex(maxZIndex + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const desktopIcons = [
        { id: 'chat', label: 'Messenger', imageUrl: '/images/chat.svg' },
        { id: 'resume', label: 'Resume.pdf', imageUrl: '/images/pdf.svg' },
        { id: 'github', label: 'GitHub', imageUrl: '/images/github-svgrepo-com.svg', externalUrl: 'https://github.com/connorhutchinson' },
        { id: 'linkedin', label: 'LinkedIn', imageUrl: '/images/linkedin-svgrepo-com.svg', externalUrl: 'https://linkedin.com/in/connor-hutchinson' },
    ];

    const startMenuItems = [
        ...desktopIcons,
        { id: WELCOME_WINDOW_ID, label: 'Welcome', imageUrl: '/images/pdf.svg' },
    ];

    const systemLinks = [
        { id: SETTINGS_WINDOW_ID, label: 'Control Panel', imageUrl: '/images/network.svg' },
    ];

    const handleIconClick = (iconId: string) => {
        setSelectedIcon(iconId);
    };

    const handleDesktopClick = () => {
        setSelectedIcon(null);
    };

    const handleIconDoubleClick = (iconId: string) => {
        // Check if this is an external link icon (GitHub, LinkedIn)
        const externalIcon = desktopIcons.find(i => i.id === iconId && i.externalUrl);

        if (externalIcon && externalIcon.externalUrl) {
            // Open external link in new tab
            window.open(externalIcon.externalUrl, '_blank', 'noopener,noreferrer');
            return;
        }

        // Handle resume PDF download
        if (iconId === 'resume') {
            const link = document.createElement('a');
            link.href = '/resources/Resume Nov 2025.pdf';
            link.download = 'Resume Nov 2025.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        const allItems = [...startMenuItems, ...systemLinks];
        const icon = allItems.find(i => i.id === iconId);

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
            if (icon) {
                let title = icon.label;
                if (iconId === SETTINGS_WINDOW_ID) {
                    title = 'Display Properties';
                }
                setWindows([...windows, {
                    id: iconId,
                    title: title,
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
        if (windowId === WELCOME_WINDOW_ID) {
            // Save to localStorage that welcome window has been closed
            localStorage.setItem(WELCOME_CLOSED_KEY, 'true');
        }
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

    const handleBackgroundChange = (background: string) => {
        setDesktopBackground(background);
        localStorage.setItem(DESKTOP_BACKGROUND_KEY, background);
    };

    const handleShutdown = () => {
        setBsodType('shutdown');
        setShowBSOD(true);
    };

    const handleRestart = () => {
        setBsodType('restart');
        setShowBSOD(true);
    };

    const handleBSODRestore = () => {
        setShowBSOD(false);
    };

    const getWindowContent = (windowId: string) => {
        switch (windowId) {
            case WELCOME_WINDOW_ID:
                return <WelcomeWindow onClose={() => handleWindowClose(WELCOME_WINDOW_ID)} />;
            case SETTINGS_WINDOW_ID:
                return (
                    <SettingsWindow
                        currentBackground={desktopBackground}
                        onBackgroundChange={handleBackgroundChange}
                    />
                );
            case 'chat':
                return <ChatWindow />;
            default:
                return <div>Window content</div>;
        }
    };

    const getDesktopStyle = () => {
        if (desktopBackground.startsWith('#')) {
            return { backgroundColor: desktopBackground };
        }

        // Progressive loading: show placeholder while loading, then swap to full quality
        const styles: React.CSSProperties = {
            backgroundColor: '#58a6de', // Windows XP default blue as fallback/placeholder
        };

        if (loadedBackground) {
            // Full quality image is loaded - use it
            styles.backgroundImage = `url(${loadedBackground})`;
        } else if (isImageLoading && desktopBackground) {
            // While loading, show a Windows XP-style gradient placeholder
            // This provides immediate visual feedback while the full image loads
            styles.backgroundImage = `linear-gradient(135deg, #58a6de 0%, #4a8bc2 50%, #3d7ba8 100%)`;
        }

        return styles;
    };

    return (
        <>
            {showBSOD && (
                <BSOD
                    type={bsodType}
                    onRestore={handleBSODRestore}
                />
            )}
            <div
                className={styles.desktop}
                style={getDesktopStyle()}
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

                {windows.map((win) => {
                    // Calculate initial position and size
                    let initialX = 100 + windows.indexOf(win) * 30;
                    let initialY = 100 + windows.indexOf(win) * 30;
                    let initialWidth: number | undefined = undefined;
                    let initialHeight: number | undefined = undefined;

                    if (win.id === WELCOME_WINDOW_ID) {
                        // Center welcome window on screen, ensure it fits on smaller screens
                        if (typeof window !== 'undefined') {
                            const maxWidth = Math.min(500, window.innerWidth - 40);
                            const maxHeight = Math.min(360, window.innerHeight - 80);
                            initialX = Math.max(20, (window.innerWidth - maxWidth) / 2);
                            initialY = Math.max(20, (window.innerHeight - maxHeight) / 2);
                            initialWidth = maxWidth;
                            initialHeight = maxHeight;
                        } else {
                            initialX = 150;
                            initialY = 150;
                            initialWidth = 500;
                            initialHeight = 360;
                        }
                    } else if (win.id === SETTINGS_WINDOW_ID) {
                        // Center settings window on screen
                        if (typeof window !== 'undefined') {
                            initialX = Math.max(100, (window.innerWidth - 520) / 2);
                            initialY = Math.max(100, (window.innerHeight - 580) / 2);
                        } else {
                            initialX = 150;
                            initialY = 150;
                        }
                        initialWidth = 520;
                        initialHeight = 580;
                    } else if (win.id === 'chat') {
                        initialWidth = 500;
                        initialHeight = 400;
                    }
                    // Resume doesn't open a window - it downloads the PDF

                    return (
                        <Window
                            key={win.id}
                            id={win.id}
                            title={win.title}
                            isMinimized={win.isMinimized}
                            isMaximized={win.isMaximized}
                            zIndex={win.zIndex}
                            onClose={() => handleWindowClose(win.id)}
                            onMinimize={() => handleWindowMinimize(win.id)}
                            onMaximize={() => handleWindowMaximize(win.id)}
                            onRestore={() => handleWindowRestore(win.id)}
                            onFocus={() => bringWindowToFront(win.id)}
                            initialX={initialX}
                            initialY={initialY}
                            initialWidth={initialWidth}
                            initialHeight={initialHeight}
                        >
                            {getWindowContent(win.id)}
                        </Window>
                    );
                })}

                <Taskbar
                    windows={windows}
                    activeWindowId={getActiveWindowId()}
                    onTaskbarButtonClick={handleTaskbarButtonClick}
                    desktopIcons={startMenuItems}
                    systemLinks={systemLinks}
                    onIconDoubleClick={handleIconDoubleClick}
                    onShutdown={handleShutdown}
                />
            </div>
        </>
    );
}