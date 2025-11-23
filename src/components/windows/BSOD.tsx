'use client';

import { useEffect, useRef } from 'react';
import styles from './BSOD.module.scss';

interface BSODProps {
    onRestore: () => void;
    type: 'shutdown' | 'restart';
}

export default function BSOD({ onRestore, type }: BSODProps) {
    const bsodRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Focus the BSOD div so keyboard events work
        if (bsodRef.current) {
            bsodRef.current.focus();
        }
    }, []);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        // Allow ESC or Enter to restore
        if (e.key === 'Escape' || e.key === 'Enter') {
            onRestore();
        }
    };

    const handleClick = () => {
        // Allow clicking anywhere to restore
        onRestore();
    };

    return (
        <div
            ref={bsodRef}
            className={styles.bsod}
            onKeyDown={handleKeyPress}
            onClick={handleClick}
            tabIndex={0}
        >
            <div className={styles.content}>
                <img
                    src="/images/sad-face.svg"
                    alt="Sad face"
                    className={styles.sadFace}
                />

                <div className={styles.textContent}>
                    <div className={styles.errorHeader}>
                        <p className={styles.errorTitle}>
                            Nice try.
                        </p>
                    </div>

                    <div className={styles.errorBody}>
                        <p className={styles.errorMessage}>
                            This is just a website, not an actual computer.
                        </p>

                        <p className={styles.errorMessage}>
                            Click anywhere or press ESC to get back to the fun.
                        </p>

                        <p className={styles.errorCode}>
                            ERROR: 0x000000000 (0xWEBSITE, 0xNOTREAL, 0xJUSTFUN, 0xCLICKME)
                        </p>

                        <div className={styles.restoreHint}>
                            <p>Press ESC or click anywhere to return to desktop</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

