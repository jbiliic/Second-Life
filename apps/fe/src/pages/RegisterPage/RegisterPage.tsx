import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MapPin } from 'lucide-react';
import Button from '@/components/Button/Button';
import { routes } from '@/constants/routes';
import styles from './RegisterPage.module.css';
import uploadIcon from '@/assets/upload.png';
import { type RegisterDTO } from './dto/register.dto';
import client from '@/api/client';

interface RegistrationResponse {
    access_token: string;
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [name, setName] = useState('');
    const [oib, setOib] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep1 = () => {
        const e: Record<string, string> = {};
        if (!name) e.name = 'Naziv firme je obavezan';
        if (!oib || oib.length !== 11) e.oib = 'OIB mora imati 11 znakova';
        if (!email) e.email = 'Email je obavezan';
        if (!password || password.length < 8) e.password = 'Lozinka mora imati najmanje 8 znakova';
        if (password !== confirmPassword) e.confirmPassword = 'Lozinke se ne podudaraju';
        if (!agreed) e.agreed = 'Morate se složiti s uvjetima korištenja';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = async () => {
        if (!validateStep1()) return;

        const registerData: RegisterDTO = {
            name,
            oib,
            email,
            password,
        };

        const { data, error } = await client.post<RegistrationResponse>(
            '/auth/register',
            registerData,
        );

        if (error || !data) {
            alert('Došlo je do pogreške prilikom registracije. Molimo pokušajte ponovno.');
            return;
        }

        localStorage.setItem('access_token', data.access_token);
        setStep(2);
    };

    const handleSubmit = async () => {
        // TODO: implement register
    };

    return (
        <div className={styles.screen}>
            {step === 1 && (
                <>
                    <div className={styles.content}>
                        <div className={styles.topRow}>
                            <h3 className={styles.title}>Kreiraj račun</h3>
                            <span className={styles.stepIndicator}>1/2</span>
                        </div>

                        <div className={styles.form}>
                            <div className={styles.field}>
                                <label className={styles.label}>Naziv firme</label>
                                <input
                                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setErrors((p) => ({ ...p, name: '' }));
                                    }}
                                />
                                {errors.name && <p className={styles.errorText}>{errors.name}</p>}
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>OIB</label>
                                <input
                                    className={`${styles.input} ${errors.oib ? styles.inputError : ''}`}
                                    type="text"
                                    maxLength={11}
                                    value={oib}
                                    onChange={(e) => {
                                        setOib(e.target.value);
                                        setErrors((p) => ({ ...p, oib: '' }));
                                    }}
                                />
                                {errors.oib && <p className={styles.errorText}>{errors.oib}</p>}
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Email</label>
                                <input
                                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors((p) => ({ ...p, email: '' }));
                                    }}
                                />
                                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Lozinka</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setErrors((p) => ({ ...p, password: '' }));
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className={styles.eyeButton}
                                        onClick={() => setShowPassword((v) => !v)}
                                    >
                                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className={styles.errorText}>{errors.password}</p>
                                )}
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Potvrda lozinke</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setErrors((p) => ({ ...p, confirmPassword: '' }));
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className={styles.eyeButton}
                                        onClick={() => setShowConfirm((v) => !v)}
                                    >
                                        {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className={styles.errorText}>{errors.confirmPassword}</p>
                                )}
                            </div>

                            <div className={styles.checkboxRow}>
                                <input
                                    id="agreed"
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={agreed}
                                    onChange={(e) => {
                                        setAgreed(e.target.checked);
                                        setErrors((p) => ({ ...p, agreed: '' }));
                                    }}
                                />
                                <label htmlFor="agreed" className={styles.checkboxLabel}>
                                    Slažem se s uvjetima korištenja
                                </label>
                            </div>
                            {errors.agreed && <p className={styles.errorText}>{errors.agreed}</p>}
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <Button text="Nastavi" onClick={handleNext} className={styles.nextButton} />
                        <p className={styles.loginText}>
                            Već imaš račun?{' '}
                            <button
                                type="button"
                                className={styles.loginLink}
                                onClick={() => navigate(routes.LOGIN)}
                            >
                                Prijavi se
                            </button>
                        </p>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <div className={styles.content}>
                        <div className={styles.topRow}>
                            <h3 className={styles.title}>Verificiraj svoju firmu</h3>
                            <span className={styles.stepIndicator}>2/2</span>
                        </div>
                        <p className={styles.subtitle}>Potrebno za sigurnost transakcija</p>

                        <div className={styles.form}>
                            <button type="button" className={styles.uploadRow}>
                                <div className={styles.uploadInfo}>
                                    <span className={styles.uploadTitle}>
                                        Izvod iz sudskog registra
                                    </span>
                                    <span className={styles.uploadSubtitle}>
                                        PDF, PG, PNG (max. 10MB)
                                    </span>
                                </div>
                                <img
                                    src={uploadIcon}
                                    alt="upload"
                                    className={styles.uploadIcon}
                                    width={20}
                                    height={20}
                                />
                            </button>

                            <button type="button" className={styles.uploadRow}>
                                <div className={styles.uploadInfo}>
                                    <span className={styles.uploadTitle}>Logo firme</span>
                                    <span className={styles.uploadSubtitle}>
                                        JPG, PNG (min.200×200 px)
                                    </span>
                                </div>
                                <img
                                    src={uploadIcon}
                                    alt="upload"
                                    className={styles.uploadIcon}
                                    width={20}
                                    height={20}
                                />
                            </button>

                            <button type="button" className={styles.uploadRow}>
                                <div className={styles.uploadInfo}>
                                    <span className={styles.uploadTitle}>
                                        Adresa preuzimanja/ dostave
                                    </span>
                                    <span className={styles.uploadSubtitle}>
                                        Upišite adresu ili odaberite na mapi
                                    </span>
                                </div>
                                <MapPin size={20} className={styles.uploadIcon} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <Button
                            text="Verificiraj me"
                            onClick={handleSubmit}
                            className={styles.nextButton}
                        />
                        <button
                            type="button"
                            className={styles.loginLink}
                            onClick={() => navigate(routes.LOGIN)}
                        >
                            Preskoči za sada
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
