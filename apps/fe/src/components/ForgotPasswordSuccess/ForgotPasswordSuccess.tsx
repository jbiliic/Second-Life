import { CircleCheck } from 'lucide-react';
import styles from './ForgotPasswordSuccess.module.css';

interface ForgotPasswordSuccessProps {
    onClose: () => void;
}

export default function ForgotPasswordSuccess({ onClose }: ForgotPasswordSuccessProps) {
    return (
        <div className={styles.screen}>
            <div className={styles.card}>
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Zatvori"
                >
                    ×
                </button>
                <CircleCheck size={32} strokeWidth={1.5} color="#204d3a" />
                <h3 className={styles.title}>Email je poslan!</h3>
                <p className={styles.subtitle}>Provjeri svoj inbox</p>
            </div>
        </div>
    );
}
