import emptyStateImg from '@/assets/emptyStateListings.png';
import { ListingCardMyListings } from '@/components/ListingCardMyListings/ListingCardMyListings';
import { useListings, type ListingFilter } from '@/hooks/useGetMyListings';
import { useNavigate } from 'react-router-dom';
import styles from './MyListingsPage.module.css';

const FILTERS: { key: ListingFilter; label: string }[] = [
    { key: 'sve', label: 'Sve' },
    { key: 'aktivno', label: 'Aktivno' },
    { key: 'neaktivno', label: 'Neaktivno' },
];

export const MyListingsPage = () => {
    const navigate = useNavigate();
    const { listings, loading, filter, setFilter } = useListings();

    const isEmpty = !loading && listings.length === 0;
    return (
        <div className={styles.page}>
            <nav aria-label="Filter oglasa">
                <div className={styles.filters}>
                    {FILTERS.map(({ key, label }) => (
                        <button
                            key={key}
                            className={`${styles.filterChip} ${filter === key ? styles.filterChipActive : ''}`}
                            onClick={() => setFilter(key)}
                            aria-pressed={filter === key}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </nav>

            {loading ? (
                <div className={styles.skeleton} aria-busy="true" aria-label="Učitavanje oglasa">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={styles.skeletonCard} />
                    ))}
                </div>
            ) : isEmpty ? (
                <div className={styles.emptyState}>
                    <img
                        src={emptyStateImg}
                        alt=""
                        className={styles.emptyIllustration}
                        aria-hidden="true"
                    />
                    <div className={styles.emptyTexts}>
                        <p className={styles.emptyTitle}>Još nemaš aktivnih oglasa</p>
                        <p className={styles.emptySubtitle}>
                            Objavi prvi oglas i počni prodavati
                            <br />
                            već danas
                        </p>
                    </div>
                    <button className={styles.emptyBtn} onClick={() => navigate('/listings/new')}>
                        Objavi prvi oglas
                    </button>
                </div>
            ) : (
                <main className={styles.list}>
                    {listings.map((listing) => (
                        <ListingCardMyListings key={listing.id} {...listing} />
                    ))}
                </main>
            )}
        </div>
    );
};
