import styles from './ListingCardHomePage.module.css';

interface ListingCardHomePageProps {
    name: string;
    quantity?: number | string;
    unit: string;
    pricePerUnit: number | string;
    isAvailable: boolean;
    imageUrl?: string;
    className?: string;
    onClick?: () => void;
}

const ListingCardHomePage = ({
    name,
    quantity,
    unit,
    pricePerUnit,
    isAvailable,
    imageUrl,
    className = '',
    onClick,
}: ListingCardHomePageProps) => {
    return (
        <article className={`${styles.card} ${className}`} onClick={onClick}>
            {imageUrl ? (
                <img className={styles.image} src={imageUrl} alt={name} />
            ) : (
                <div className={styles.imagePlaceholder} aria-hidden="true" />
            )}
            <div className={styles.body}>
                <h3 className={styles.title}>{name}</h3>
                {typeof quantity !== 'undefined' && (
                    <span className={styles.meta}>
                        {quantity} {unit}
                    </span>
                )}
                <span className={styles.price}>
                    {pricePerUnit} / {unit}
                </span>
                <span className={styles.status}>{isAvailable ? 'Dostupno' : 'Nedostupno'}</span>
            </div>
        </article>
    );
};

export default ListingCardHomePage;
