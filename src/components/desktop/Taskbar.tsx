'use client';

import { useState, useEffect } from 'react';
import styles from './Taskbar.module.scss';
import StartMenu from './StartMenu';
import { WindowState } from './Desktop';

interface DesktopIcon {
    id: string;
    label: string;
    imageUrl: string;
    externalUrl?: string;
}

interface SystemLink {
    id: string;
    label: string;
    imageUrl: string;
}

interface TaskbarProps {
    windows: WindowState[];
    activeWindowId: string | null;
    onTaskbarButtonClick: (windowId: string) => void;
    desktopIcons: DesktopIcon[];
    systemLinks: SystemLink[];
    onIconDoubleClick: (iconId: string) => void;
    onShutdown?: () => void;
}

export default function Taskbar({ windows, activeWindowId, onTaskbarButtonClick, desktopIcons, systemLinks, onIconDoubleClick, onShutdown }: TaskbarProps) {
    const [time, setTime] = useState('');
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            setTime(`${displayHours}:${minutes} ${ampm}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleStartClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsStartMenuOpen(!isStartMenuOpen);
    };

    const handleTaskbarButtonClick = (e: React.MouseEvent, windowId: string) => {
        e.stopPropagation();
        onTaskbarButtonClick(windowId);
    };

    const handleMessengerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Open chat window if not already open, or bring it to front if it is
        onIconDoubleClick('chat');
    };

    const getIconForWindow = (windowId: string) => {
        const icon = desktopIcons.find(i => i.id === windowId);
        return icon?.imageUrl || '/images/pdf.svg';
    };

    // Check if chat window is open (not minimized)
    const isChatWindowOpen = windows.some(w => w.id === 'chat' && !w.isMinimized);
    const messengerIcon = isChatWindowOpen ? '/images/messenger.svg' : '/images/messenger-offline.svg';

    return (
        <>
            <div className={styles.taskbar}>
                <button className={styles.startButton} onClick={handleStartClick}>
                    <span>Start</span>
                </button>

                <div className={styles.taskbarApps}>
                    {windows.map((window) => {
                        const isActive = activeWindowId === window.id && !window.isMinimized;
                        const buttonClasses = [
                            styles.taskbarButton,
                            isActive ? styles.active : '',
                            window.isMinimized ? styles.minimized : '',
                        ].filter(Boolean).join(' ');

                        return (
                            <button
                                key={window.id}
                                className={buttonClasses}
                                onClick={(e) => handleTaskbarButtonClick(e, window.id)}
                            >
                                <div className={styles.buttonIcon}>
                                    <img
                                        src={getIconForWindow(window.id)}
                                        alt={window.title}
                                        width={16}
                                        height={16}
                                    />
                                </div>
                                <span className={styles.buttonText}>{window.title}</span>
                            </button>
                        );
                    })}
                </div>

                <div className={styles.systemTray}>
                    <div className={styles.trayIcon}>
                        <img src="/images/volume.svg" alt="Volume" width={16} height={16} />
                    </div>
                    <div className={styles.trayIcon}>
                        <img src="/images/network.svg" alt="Network" width={16} height={16} />
                    </div>
                    <div className={styles.trayIcon} onClick={handleMessengerClick} style={{ cursor: 'pointer' }}>
                        <img src={messengerIcon} alt="Messenger" width={16} height={16} />
                    </div>
                    <div className={styles.time}>{time}</div>
                </div>
            </div>
            <StartMenu
                isOpen={isStartMenuOpen}
                onClose={() => setIsStartMenuOpen(false)}
                desktopIcons={desktopIcons}
                systemLinks={systemLinks}
                onIconClick={onIconDoubleClick}
                onShutdown={onShutdown}
            />
        </>
    );
}