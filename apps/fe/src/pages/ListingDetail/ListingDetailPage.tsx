import deliveryIcon from '@/assets/icons/delivery-icon.svg';
import locationIcon from '@/assets/icons/location-icon.svg';
import Button from '@/components/Button/Button';
import { mockListing } from '@/constants/listingDetail.mock';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ListingDetailPage.module.css';

const ListingDetailPage = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const startX = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;

        console.log('start');
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (startX.current === null) return;

        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX.current;

        const threshold = 50;

        if (diff < -threshold) {
            setActiveIndex((prev) => (prev < mockListing.images.length - 1 ? prev + 1 : prev));
        }

        if (diff > threshold) {
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }

        startX.current = null;

        console.log('end');
    };

    return (
        <div className={styles.container}>
            <div className={styles.listingContainer}>
                <div className={styles.listingDetails}>
                    <div
                        className={styles.imageContainer}
                        aria-label="Slika oglasa"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <img
                            src={mockListing.images[activeIndex].image_url}
                            alt={`Slika ${activeIndex + 1}`}
                            className={styles.mainImage}
                        />

                        <div className={styles.dots}>
                            {mockListing.images.map((_, index) => (
                                <span
                                    key={index}
                                    className={`${styles.dot} ${
                                        index === activeIndex ? styles.activeDot : ''
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className={styles.infoContainer}>
                        <p className={styles.title}>
                            {mockListing.title} ({mockListing.condition})
                        </p>
                        <p className={styles.subtitle}>
                            {mockListing.price_per_unit} €/{mockListing.unit}
                        </p>
                        <p className={styles.info}>
                            Dostupno {mockListing.quantity} {mockListing.unit}
                        </p>
                        <p className={styles.info}>Ističe {mockListing.expires_at}</p>
                    </div>
                </div>
                <div className={styles.companyInfo}>
                    <img src={deliveryIcon} alt="Dostava" className={styles.deliveryIcon} />
                    <div className={styles.companyInfoText}>
                        <span className={styles.companyText}>{mockListing.company.name}</span>
                        {mockListing.company.is_verified && (
                            <span className={styles.companyLabel}>Verificirano</span>
                        )}
                    </div>
                </div>
                <div className={styles.location}>
                    <img src={locationIcon} alt="Lokacija" className={styles.locationIcon} />
                    <div className={styles.locationInfo}>
                        <span className={styles.locationLabel}>Lokacija preuzimanja</span>
                        <span className={styles.locationText}>
                            {mockListing.location.city}, {mockListing.location.street}{' '}
                            {mockListing.location.street_number}
                        </span>
                    </div>
                </div>
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

export default ListingDetailPage;
