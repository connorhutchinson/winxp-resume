'use client';

import { useEffect } from 'react';
import styles from './StartMenu.module.scss';

interface StartMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StartMenu({ isOpen, onClose }: StartMenuProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => {
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.startMenu} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <span className={styles.userName}>Connor</span>
                </div>
                <div className={styles.content}>
                    <div className={styles.leftColumn}>
                        {/* Apps will be added here */}
                    </div>
                    <div className={styles.rightColumn}>
                        {/* System links will be added here */}
                    </div>
                </div>
            </div>
        </>
    );
}

