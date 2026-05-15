import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import client from '@/api/client';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router';
import { routes } from '@/constants/routes';
import { useAuth } from '@/providers/auth/useAuth';

interface LoginResponse {
    access_token: string;
    companyName: string;
}

export default function Login() {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(false);

        const { data, error } = await client.post<LoginResponse>('/auth/login', {
            email,
            password,
        });

        if (error || !data) {
            setEmail('');
            setPassword('');
            setError(true);
            return;
        }

<<<<<<< HEAD
        localStorage.setItem('access_token', data.access_token);
=======
        login(data.access_token, data.companyName);
>>>>>>> 1a42667af3b550c81822f73e3c1af31c069d95e7
        navigate(routes.HOME);
    };

    return (
        <div className={styles.screen}>
            <div className={styles.content}>
                <h1 className={styles.title}>Prijava</h1>

                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            className={`${styles.input} ${error ? styles.inputError : ''}`}
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(false);
                            }}
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="password">
                            Lozinka
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="password"
                                className={`${styles.input} ${error ? styles.inputError : ''}`}
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(false);
                                }}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className={styles.eyeButton}
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className={styles.errorText}>Prijava neuspješna.</p>}

                    <button
                        type="button"
                        className={styles.forgotPassword}
                        onClick={() => navigate(routes.FORGOT_PASSWORD)}
                    >
                        Zaboravili ste lozinku?
                    </button>
                </form>
            </div>

            <div className={styles.footer}>
                <Button type="submit" text="Prijavi se" onClick={handleLogin} />
                <p className={styles.registerText}>
                    Nemaš račun?{' '}
                    <button
                        type="button"
                        className={styles.registerLink}
                        onClick={() => navigate(routes.REGISTER)}
                    >
                        Registriraj se
                    </button>
                </p>
            </div>
        </div>
    );
}
