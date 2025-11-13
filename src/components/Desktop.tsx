'use client';

import { useState } from 'react';
import DesktopIcon from './DesktopIcon';
import styles from './Desktop.module.scss';
import Taskbar from './Taskbar';

export default function Desktop() {
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

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
        console.log(`Opening: ${iconId}`);
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
            <Taskbar />
        </div>
    );
}