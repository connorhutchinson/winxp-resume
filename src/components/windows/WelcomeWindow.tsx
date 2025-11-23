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
                        Hi, welcome to my portfolio website!
                        I'm no pro designer, so I took a few cues from the main OS
                        I remember growing up with as a kid that got me into computing and made a fun website for me to keep building upon and experimenting with.
                    </p>
                </div>

                <div className={styles.section}>
                    <p className={styles.paragraph}>
                        Feel free to explore everything. I built this website with some of my favourite frontend tools:
                        <strong>React</strong>, <strong>Next.js</strong>,
                        <strong>TypeScript</strong>, <strong>Sass</strong> and <strong>CSS Modules</strong>.
                        And if you have any questions about my experience and past projects, make sure to chat with me
                        (it's not me, it's totally an AI wrapper just knowing about my work and dev history but it does at least look like MSN which I know I spent way too much time on)
                        in the chat app.
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

