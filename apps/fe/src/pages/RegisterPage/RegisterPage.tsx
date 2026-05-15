import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Button from '@/components/Button/Button';
import { routes } from '@/constants/routes';
import styles from './RegisterPage.module.css';
import uploadIcon from '@/assets/upload.png';
import { type RegisterDTO } from './dto/register.dto';
import client from '@/api/client';
import LocationPicker from '@/components/LocationPicker/LocationPicker';
import FileUpload from '@/components/FileUpload/FileUpload';
import { Input } from '@/components/InputForm/InputForm';
import { useAuth } from '@/providers/auth/useAuth';

interface RegistrationResponse {
    access_token: string;
    companyName: string;
}

export default function RegisterPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [name, setName] = useState('');
    const [oib, setOib] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [registryFile, setRegistryFile] = useState<File | null>(null);

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
            alert(error);
            return;
        }
        if (registryFile) {
        }

        login(data.access_token, data.companyName);
        setStep(2);
    };

    const handleSubmit = async () => {
        navigate(routes.HOME);

        if (logoFile) {
            const formData = new FormData();
            formData.append('file', logoFile);

            const { data, error } = await client.patch('/companies/me/logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (error || !data) {
                alert(
                    'Došlo je do pogreške prilikom učitavanja logotipa. Molimo pokušajte ponovno kasnije.',
                );
            }
        }

        if (location) {
            const { data, error } = await client.post('/companies/locations', location);
            if (error || !data) {
                alert(
                    'Došlo je do pogreške prilikom dodavanja lokacije. Molimo pokušajte ponovno kasnije.',
                );
            }
        }
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
                            <Input
                                label="Naziv firme"
                                value={name}
                                onChange={(v) => {
                                    setName(v);
                                    setErrors((p) => ({ ...p, name: '' }));
                                }}
                                error={errors.name}
                            />
                            <Input
                                label="OIB"
                                value={oib}
                                onChange={(v) => {
                                    setOib(v);
                                    setErrors((p) => ({ ...p, oib: '' }));
                                }}
                                error={errors.oib}
                                maxLength={11}
                            />
                            <Input
                                label="Email"
                                value={email}
                                onChange={(v) => {
                                    setEmail(v);
                                    setErrors((p) => ({ ...p, email: '' }));
                                }}
                                error={errors.email}
                                type="email"
                            />
                            <Input
                                label="Lozinka"
                                value={password}
                                onChange={(v) => {
                                    setPassword(v);
                                    setErrors((p) => ({ ...p, password: '' }));
                                }}
                                error={errors.password}
                                type="password"
                            />
                            <Input
                                label="Potvrda lozinke"
                                value={confirmPassword}
                                onChange={(v) => {
                                    setConfirmPassword(v);
                                    setErrors((p) => ({ ...p, confirmPassword: '' }));
                                }}
                                error={errors.confirmPassword}
                                type="password"
                            />

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
                            <FileUpload
                                title="Izvod iz sudskog registra"
                                subtitle="PDF, PG, PNG (max. 10MB)"
                                accept="application/pdf,image/png"
                                icon={<img src={uploadIcon} alt="upload" width={20} height={20} />}
                                onChange={(file) => setRegistryFile(file)}
                            />

                            <FileUpload
                                title="Logo firme"
                                subtitle="JPG, PNG (min.200×200 px)"
                                accept="image/jpeg,image/png"
                                icon={<img src={uploadIcon} alt="upload" width={20} height={20} />}
                                onChange={(file) => setLogoFile(file)}
                            />

                            <button
                                type="button"
                                className={styles.uploadRow}
                                onClick={() => setShowMap(true)}
                            >
                                <div className={styles.uploadInfo}>
                                    <span className={styles.uploadTitle}>
                                        Adresa preuzimanja/ dostave
                                    </span>
                                    <span className={styles.uploadSubtitle}>
                                        {location
                                            ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                                            : 'Upišite adresu ili odaberite na mapi'}
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
                            onClick={() => navigate(routes.HOME)}
                        >
                            Preskoči za sada
                        </button>
                    </div>
                    {showMap && (
                        <LocationPicker
                            onConfirm={(coords) => {
                                setLocation(coords);
                                setShowMap(false);
                            }}
                            onClose={() => setShowMap(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
}
