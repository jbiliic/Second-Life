import styles from './ListingCardHomePage.module.css';

interface ListingCardHomePageProps {
    name: string;
    materialCondition: string;
    quantity?: number | string;
    unit: string;
    pricePerUnit: number | string;
    isAvailable: boolean;
    imageUrl?: string;
    className?: string;
}

const ListingCardHomePage = ({
    name,
    materialCondition,
    quantity,
    unit,
    pricePerUnit,
    isAvailable,
    imageUrl,
    className = '',
}: ListingCardHomePageProps) => {
    return (
        <article className={`${styles.card} ${className}`}>
            {imageUrl ? (
                <img className={styles.image} src={imageUrl} alt={name} />
            ) : (
                <div className={styles.imagePlaceholder} aria-hidden="true" />
            )}
            <div className={styles.body}>
                <h3 className={styles.title}>{name}</h3>
                <span className={styles.meta}>{materialCondition}</span>
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
