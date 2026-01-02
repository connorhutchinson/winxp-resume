'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AudioContextType {
    isMuted: boolean;
    toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);

    // Load mute state from localStorage on mount
    useEffect(() => {
        const savedMuteState = localStorage.getItem('chatAudioMuted');
        if (savedMuteState === 'true') {
            setIsMuted(true);
        }
    }, []);

    const toggleMute = () => {
        setIsMuted((prev) => {
            const newState = !prev;
            localStorage.setItem('chatAudioMuted', newState.toString());
            return newState;
        });
    };

    return (
        <AudioContext.Provider value={{ isMuted, toggleMute }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}

