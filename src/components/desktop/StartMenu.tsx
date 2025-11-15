'use client';

import { useEffect } from 'react';
import styles from './StartMenu.module.scss';

interface DesktopIcon {
    id: string;
    label: string;
    imageUrl: string;
}

interface SystemLink {
    id: string;
    label: string;
    imageUrl: string;
}

interface StartMenuProps {
    isOpen: boolean;
    onClose: () => void;
    desktopIcons: DesktopIcon[];
    systemLinks: SystemLink[];
    onIconClick: (iconId: string) => void;
}

export default function StartMenu({ isOpen, onClose, desktopIcons, systemLinks, onIconClick }: StartMenuProps) {
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
                        <div className={styles.systemLinks}>
                            {systemLinks.map((link) => (
                                <button
                                    key={link.id}
                                    className={styles.systemLink}
                                    onClick={() => handleMenuItemClick(link.id)}
                                >
                                    <div className={styles.systemIcon}>
                                        <img
                                            src={link.imageUrl}
                                            alt={link.label}
                                            width={20}
                                            height={20}
                                        />
                                    </div>
                                    <span className={styles.systemLabel}>{link.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

