import { useNavigate } from 'react-router-dom';
import styles from './ListingCard.module.css';

export type ListingCardProps = {
    id: string;
    title: string;
    condition: string;
    quantity: number;
    unit: string;
    location: string;
    distance_km: number | null;
    available_until: string;
    pricePerUnit: number;
    imageUrl: string;
};

const ListingCard = ({
    id,
    title,
    condition,
    quantity,
    unit,
    location,
    distance_km,
    available_until,
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
                <span className={styles.title}>
                    {title} ({condition})
                </span>

                <span className={styles.caption}>
                    {quantity} {unit}; {pricePerUnit.toFixed(2)} €/{unit}
                </span>

                <span className={styles.caption}>
                    {location} {distance_km !== null ? `, ${Math.round(distance_km)} km` : ''}
                </span>

                <span className={styles.caption}>{available_until}</span>
            </div>
        </div>
    );
};

export default ListingCard;
