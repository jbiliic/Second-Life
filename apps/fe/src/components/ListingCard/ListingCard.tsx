import { useNavigate } from 'react-router-dom';
import styles from './ListingCard.module.css';

export type ListingCardProps = {
    id: string;
    title: string;
    condition: string;
    unit: string;
    location: string;
    pricePerUnit: number;
    imageUrl: string;
};

const ListingCard = ({
    id,
    title,
    condition,
    unit,
    location,
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
                    {pricePerUnit.toFixed(2)} €/{unit}
                </span>

                <span className={styles.caption}>{location}</span>
            </div>
        </div>
    );
};

export default ListingCard;
