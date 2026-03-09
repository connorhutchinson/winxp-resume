'use client';

import styles from './WelcomeWindow.module.scss';

interface WelcomeWindowProps {
    onClose: () => void;
}

export default function WelcomeWindow({ onClose }: WelcomeWindowProps) {
    return (
        <div className={styles.welcomeWindow}>
            <div className={styles.header}>
                <div className={styles.icon}>
                    <img src="/images/pdf.svg" alt="Welcome" width={32} height={32} />
                </div>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Welcome!</h1>
                    <p className={styles.subtitle}>Thanks for visiting my portfolio</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <p className={styles.paragraph}>
                        Hi, I'm Connor. Senior dev at Instacart—full stack, from frontend through to .NET and app development.
                    </p>
                </div>
                <div className={styles.section}>
                    <p className={styles.paragraph}>
                        I built this site with a WinXP feel, the OS that got me into computing. Have questions about my experience or projects? The chat knows my work.
                    </p>
                </div>
                <div className={styles.section}>
                    <p className={styles.paragraph}>
                        When I'm not shipping features at Instacart, I'm tinkering with personal projects, designing and printing 3D models or when winter rolls around, snowboarding.
                    </p>
                </div>

                <div className={styles.footer}>
                    <button
                        className={styles.okButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

