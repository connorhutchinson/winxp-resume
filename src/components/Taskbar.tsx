'use client';

import { useState, useEffect } from 'react';
import styles from './Taskbar.module.scss';
import StartMenu from './StartMenu';

export default function Taskbar() {
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

    return (
        <>
            <div className={styles.taskbar}>
                <button className={styles.startButton} onClick={handleStartClick}>
                    <span>Start</span>
                </button>

                <div className={styles.taskbarApps}>
                    {/* Windows will be added here */}
                </div>

                <div className={styles.systemTray}>
                    <div className={styles.trayIcon}>
                        <img src="/images/volume.svg" alt="Volume" width={16} height={16} />
                    </div>
                    <div className={styles.trayIcon}>
                        <img src="/images/network.svg" alt="Network" width={16} height={16} />
                    </div>
                    <div className={styles.trayIcon}>
                        <img src="/images/messenger.svg" alt="Messenger" width={16} height={16} />
                    </div>
                    <div className={styles.time}>{time}</div>
                </div>
            </div>
            <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />
        </>
    );
}