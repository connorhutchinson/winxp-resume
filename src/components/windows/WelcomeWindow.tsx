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
                    <p className={styles.subtitle}>Thanks for visiting my resume</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <p className={styles.paragraph}>
                        Welcome to my interactive resume! I've designed this site to look like Windows XP because it's the operating system I first grew up with. It holds a special place in my heart as the OS that introduced me to computing.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>What you can do here:</h2>
                    <ul className={styles.featureList}>
                        <li>
                            <strong>Chat with my resume</strong> - Double-click the icon to ask questions about my experience and skills
                        </li>
                        <li>
                            <strong>Explore my resume</strong> - View my professional background and qualifications
                        </li>
                        <li>
                            <strong>Contact me</strong> - Get in touch if you'd like to connect
                        </li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <p className={styles.paragraph}>
                        Feel free to explore around - everything works just like the classic Windows XP interface you remember (or have heard about)! You can drag windows, minimize, maximize, and interact with everything.
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

