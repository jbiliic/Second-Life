import Button from '@/components/Button/Button';
import { useNavigate } from 'react-router-dom';
import styles from './SingleListingPage.module.css';

const SingleListingPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.listingCard}>
                <h1>Single Listing Page</h1>
                <p>This page will display the details of a single listing.</p>
            </div>
            <Button
                disabled={true}
                text="Rezerviraj"
                onClick={() => navigate(-1)}
                className={styles.reserveButton}
            />
        </div>
    );
};

export default SingleListingPage;
