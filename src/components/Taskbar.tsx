'use client';

import { useState, useEffect } from 'react';
import styles from './Taskbar.module.scss';

export default function Taskbar() {
    const [time, setTime] = useState('');

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

    return (
        <div className={styles.taskbar}>
            <button className={styles.startButton}>
                <div className={styles.startLogo}>⊞</div>
                <span>Start</span>
            </button>

            <div className={styles.taskbarApps}>
                {/* Windows will be added here */}
            </div>

            <div className={styles.systemTray}>
                <div className={styles.trayIcon}>VOL</div>
                <div className={styles.trayIcon}>NET</div>
                <div className={styles.trayIcon}>SEC</div>
                <div className={styles.trayIcon}>UPD</div>
                <div className={styles.time}>{time}</div>
            </div>
        </div>
    );
}