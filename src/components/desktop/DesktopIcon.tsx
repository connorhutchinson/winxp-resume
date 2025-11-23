'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './DesktopIcon.module.scss';

interface DesktopIconProps {
    id: string;
    label: string;
    imageUrl: string;
    isSelected: boolean;
    onClick: (id: string) => void;
    onDoubleClick: (id: string) => void;
}

export default function DesktopIcon({
    id,
    label,
    imageUrl,
    isSelected,
    onClick,
    onDoubleClick,
}: DesktopIconProps) {
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            const isMobileDevice = typeof window !== 'undefined' && (
                window.innerWidth <= 768 ||
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            );
            setIsMobile(isMobileDevice);
        };

        checkMobile();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (isMobile) {
            // On mobile, single tap opens the window (no selection needed)
            onDoubleClick(id);
        } else {
            // On desktop, single click selects the icon
            onClick(id);
        }
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Only handle double click on desktop (mobile uses single tap)
        if (!isMobile) {
            onDoubleClick(id);
        }
    };

    return (
        <div
            className={`${styles.icon} ${isSelected ? styles.iconSelected : styles.iconUnselected}`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            {/* Icon Image */}
            <div className={styles.iconImage}>
                {imageUrl.endsWith('.svg') ? (
                    <img src={imageUrl} alt={label} className={styles.iconImageInner} />
                ) : (
                    <Image src={imageUrl} alt={label} width={40} height={40} className={styles.iconImageInner} />
                )}
            </div>

            {/* Icon Label */}
            <div className={styles.iconLabel}>
                {label}
            </div>
        </div>
    );
}