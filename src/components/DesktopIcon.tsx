'use client';

import Image from 'next/image';

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
            className={`
        flex flex-col items-center w-20 p-2 rounded cursor-pointer
        transition-all duration-200
        ${isSelected
                    ? 'bg-[rgba(51,153,255,0.4)] border border-white border-dotted'
                    : 'hover:bg-[rgba(255,255,255,0.3)] hover:border hover:border-dotted hover:border-[rgba(255,255,255,0.6)]'
                }
      `}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            {/* Icon Image */}
            <div className="w-8 h-8 mb-1 rounded flex items-center justify-center text-sm font-bold text-[#0066cc] bg-gradient-to-br from-white to-[#e0e0e0] border border-[#999] shadow-[2px_2px_4px_rgba(0,0,0,0.3)]">
                {imageUrl.endsWith('.svg') ? (
                    <img src={imageUrl} alt={label} width={32} height={32} className="object-contain" />
                ) : (
                    <Image src={imageUrl} alt={label} width={32} height={32} />
                )}
            </div>

            {/* Icon Label */}
            <div className="text-white text-[11px] text-center break-words bg-[rgba(0,0,0,0.3)] px-1 py-0.5 rounded-sm shadow-[1px_1px_3px_rgba(0,0,0,0.8)]">
                {label}
            </div>
        </div>
    );
}