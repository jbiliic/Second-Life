import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './InputForm.module.css';

interface InputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: 'text' | 'email' | 'password';
    maxLength?: number;
}

export const Input = ({ label, value, onChange, error, type = 'text', maxLength }: InputProps) => {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className={styles.field}>
            <label className={styles.label}>{label}</label>
            <div className={styles.inputWrapper}>
                <input
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                    type={isPassword ? (show ? 'text' : 'password') : type}
                    value={value}
                    maxLength={maxLength}
                    onChange={(e) => onChange(e.target.value)}
                />
                {isPassword && (
                    <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={() => setShow((v) => !v)}
                    >
                        {show ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                )}
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
};
