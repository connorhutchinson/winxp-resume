'use client';

import { useState } from 'react';
import DesktopIcon from './DesktopIcon';

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
            className="relative h-screen w-full overflow-hidden bg-[#58a6de] cursor-default"
            style={{
                backgroundImage: 'url(/images/background.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                fontFamily: 'Tahoma, sans-serif',
            }}
            onClick={handleDesktopClick}
        >
            <div className="absolute top-5 left-5 flex flex-col gap-6">
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
        </div>
    );
}