import Button from '@/components/Button/Button';
import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Greška 404</h1>

            <h2 className={styles.subtitle}>Stranica nije pronađena</h2>

            <Button text="Povratak na početnu" onClick={() => navigate('/home')} />
        </div>
    );
};

export default NotFoundPage;
