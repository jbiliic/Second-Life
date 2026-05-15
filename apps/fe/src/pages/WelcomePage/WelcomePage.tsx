import Button from '@/components/Button/Button';
import Identity from '@/components/Identity/Identity';
import { routes } from '@/constants/routes';
import { Link, useNavigate } from 'react-router-dom';
import styles from './WelcomePage.module.css';

const WelcomePage = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <Identity />

            <div className={styles.content}>
                <Button text="Nastavi" onClick={() => navigate(routes.REGISTER)} />
                <p className={styles.loginText}>
                    Već imaš račun?{' '}
                    <Link to={routes.LOGIN} className={styles.loginLink}>
                        Prijavi se
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default WelcomePage;
