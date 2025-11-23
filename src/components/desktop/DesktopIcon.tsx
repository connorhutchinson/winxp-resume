'use client';

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
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(id);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDoubleClick(id);
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