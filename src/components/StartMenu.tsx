'use client';

import { useEffect } from 'react';
import styles from './StartMenu.module.scss';

interface DesktopIcon {
    id: string;
    label: string;
    imageUrl: string;
}

interface StartMenuProps {
    isOpen: boolean;
    onClose: () => void;
    desktopIcons: DesktopIcon[];
    onIconClick: (iconId: string) => void;
}

export default function StartMenu({ isOpen, onClose, desktopIcons, onIconClick }: StartMenuProps) {
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

    const handleMenuItemClick = (iconId: string) => {
        onIconClick(iconId);
        onClose();
    };

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
                        {desktopIcons.map((icon) => (
                            <button
                                key={icon.id}
                                className={styles.menuItem}
                                onClick={() => handleMenuItemClick(icon.id)}
                            >
                                <div className={styles.menuIcon}>
                                    <img
                                        src={icon.imageUrl}
                                        alt={icon.label}
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                <span className={styles.menuLabel}>{icon.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className={styles.rightColumn}>
                        {/* System links will be added here */}
                    </div>
                </div>
            </div>
        </>
    );
}

