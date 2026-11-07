'use client';

import styles from './WelcomeWindow.module.scss';
import { contact, pitch, resumePdfPath } from '../../data/resume';

interface WelcomeWindowProps {
    onClose: () => void;
    onOpenResume?: () => void;
    onOpenChat?: () => void;
}

export default function WelcomeWindow({ onClose, onOpenResume, onOpenChat }: WelcomeWindowProps) {
    return (
        <div className={styles.welcomeWindow}>
            <div className={styles.header}>
                <div className={styles.icon}>
                    <img src="/images/notepad.svg" alt="" width={28} height={28} />
                </div>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>{contact.name}</h1>
                    <p className={styles.subtitle}>{contact.title} &middot; {contact.location}</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <p className={styles.paragraph}>{pitch}</p>
                </div>
                <div className={styles.section}>
                    <p className={styles.paragraph}>
                        I built this site with a Windows XP feel, the OS that got me into computing. Have questions
                        about my experience or projects? Ask ConnorBot in the chat, it knows my whole resume.
                    </p>
                </div>

                <div className={styles.footer} style={{ gap: '8px' }}>
                    <a className={styles.okButton} href="/resume" onClick={(e) => {
                        if (onOpenResume) {
                            e.preventDefault();
                            onOpenResume();
                        }
                    }}>
                        View resume
                    </a>
                    <a className={styles.okButton} href={resumePdfPath} download>
                        Download CV
                    </a>
                    <button
                        className={styles.okButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenChat) {
                                onOpenChat();
                            } else {
                                onClose();
                            }
                        }}
                    >
                        Chat with ConnorBot
                    </button>
                </div>
            </div>
        </div>
    );
}
