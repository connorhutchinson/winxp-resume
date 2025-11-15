'use client';

import { useState, useEffect } from 'react';
import styles from './SettingsWindow.module.scss';

interface SettingsWindowProps {
    currentBackground: string;
    onBackgroundChange: (background: string) => void;
}

const backgrounds = [
    { id: 'default', name: 'Bliss', value: '/images/background.jpeg', type: 'image' },
    { id: 'blue', name: 'Azul', value: '#58a6de', type: 'color' },
    { id: 'green', name: 'Olive Green', value: '#3a6e3a', type: 'color' },
    { id: 'red', name: 'Red Desert', value: '#d74f4f', type: 'color' },
    { id: 'purple', name: 'Purple Haze', value: '#6d5a9e', type: 'color' },
    { id: 'orange', name: 'Orange Sunset', value: '#e67e22', type: 'color' },
    { id: 'teal', name: 'Teal', value: '#2c8c8c', type: 'color' },
];

export default function SettingsWindow({ currentBackground, onBackgroundChange }: SettingsWindowProps) {
    const [selectedBackground, setSelectedBackground] = useState(currentBackground);
    const [previewBackground, setPreviewBackground] = useState(currentBackground);

    useEffect(() => {
        setSelectedBackground(currentBackground);
        setPreviewBackground(currentBackground);
    }, [currentBackground]);

    const handleBackgroundSelect = (background: typeof backgrounds[0]) => {
        setSelectedBackground(background.value);
        setPreviewBackground(background.value);
    };

    const handleApply = () => {
        onBackgroundChange(selectedBackground);
    };

    const getBackgroundStyle = (value: string) => {
        if (value.startsWith('#')) {
            return { backgroundColor: value };
        }
        return {
            backgroundImage: `url(${value})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        };
    };

    const currentBg = backgrounds.find(bg => bg.value === currentBackground);

    return (
        <div className={styles.settingsWindow}>
            <div className={styles.header}>
                <h2 className={styles.title}>Display Properties</h2>
            </div>
            
            <div className={styles.tabs}>
                <div className={`${styles.tab} ${styles.active}`}>Background</div>
                <div className={styles.tab}>Screen Saver</div>
                <div className={styles.tab}>Appearance</div>
                <div className={styles.tab}>Settings</div>
            </div>

            <div className={styles.content}>
                <div className={styles.preview}>
                    <div className={styles.monitor}>
                        <div 
                            className={styles.screen}
                            style={getBackgroundStyle(previewBackground)}
                        >
                            <div className={styles.miniIcon}></div>
                        </div>
                        <div className={styles.monitorStand}></div>
                    </div>
                </div>

                <div className={styles.controls}>
                    <div className={styles.listSection}>
                        <label className={styles.label}>Select a background:</label>
                        <select 
                            className={styles.select}
                            value={selectedBackground}
                            onChange={(e) => {
                                const bg = backgrounds.find(b => b.value === e.target.value);
                                if (bg) handleBackgroundSelect(bg);
                            }}
                        >
                            {backgrounds.map(bg => (
                                <option key={bg.id} value={bg.value}>
                                    {bg.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.colorGrid}>
                        {backgrounds.map(bg => (
                            <button
                                key={bg.id}
                                className={`${styles.colorSwatch} ${selectedBackground === bg.value ? styles.selected : ''}`}
                                style={bg.type === 'color' ? { backgroundColor: bg.value } : {
                                    backgroundImage: `url(${bg.value})`,
                                    backgroundSize: 'cover',
                                }}
                                onClick={() => handleBackgroundSelect(bg)}
                                title={bg.name}
                            />
                        ))}
                    </div>

                    <div className={styles.currentInfo}>
                        <strong>Current:</strong> {currentBg?.name || 'Custom'}
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.button} onClick={handleApply}>
                    Apply
                </button>
            </div>
        </div>
    );
}

