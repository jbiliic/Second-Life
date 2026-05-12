// ForgotPasswordPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button/Button';
import client from '@/api/client';
import { routes } from '@/constants/routes';
import ForgotPasswordSuccess from '@/components/ForgotPasswordSuccess/ForgotPasswordSuccess';
import styles from './ForgotPasswordPage.module.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError(false);

        const { error } = await client.post('/auth/reset-password', { email });

        if (error) {
            setError(true);
            return;
        }

        setSuccess(true);
    };

    if (success) {
        return <ForgotPasswordSuccess onClose={() => navigate(routes.LOGIN)} />;
    }

    return (
        <div className={styles.screen}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Resetiraj lozinku</h3>
                    <p className={styles.subtitle}>
                        Unesite email i poslat ćemo Vam link za resetiranje lozinke
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        className={`${styles.input} ${error ? styles.inputError : ''}`}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError(false);
                        }}
                        autoComplete="email"
                    />
                    {error && (
                        <p className={styles.errorText}>
                            Nešto je pošlo po krivu. Pokušajte ponovo.
                        </p>
                    )}
                </form>
            </div>

            <div className={styles.footer}>
                <Button
                    type="submit"
                    text="Pošalji link za reset"
                    onClick={handleSubmit}
                    className={styles.footerBtn}
                />
                <button
                    type="button"
                    className={styles.backLink}
                    onClick={() => navigate(routes.LOGIN)}
                >
                    Povratak na prijavu
                </button>
            </div>
        </div>
    );
}
