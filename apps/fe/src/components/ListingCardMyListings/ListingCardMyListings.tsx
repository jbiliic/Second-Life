import { useNavigate } from 'react-router-dom';
import styles from './ListingCard.module.css';

type ListingCardProps = {
    id: string;
    title: string;
    quantity: number;
    unit: string;
    location: string;
    distanceKm: number;
    expiresAt: string;
    co2SavedKg: number;
    pricePerUnit: number;
    imageUrl: string;
};

export const ListingCard = ({
    id,
    title,
    quantity,
    unit,
    location,
    distanceKm,
    expiresAt,
    co2SavedKg,
    pricePerUnit,
    imageUrl,
}: ListingCardProps) => {
    const navigate = useNavigate();
    return (
        <div
            className={styles.card}
            onClick={() => navigate(`/listings/${id}`)}
            role="button"
            tabIndex={0}
        >
            <img src={imageUrl} alt={title} className={styles.image} />
            <div className={styles.content}>
                <div className={styles.row}>
                    <span className={styles.title}>{title}</span>
                    <span className={styles.price}>
                        {pricePerUnit.toFixed(2)}€/{unit}
                    </span>
                </div>
                <span className={styles.caption}>
                    {quantity} {unit}
                </span>
                <span className={styles.caption}>
                    {location}, {distanceKm}km
                </span>
                <div className={styles.row}>
                    <span className={styles.caption}>Ističe: {expiresAt}</span>
                    <span className={styles.caption}>CO2; {co2SavedKg} kg</span>
                </div>
            </div>
        </div>
    );
};
