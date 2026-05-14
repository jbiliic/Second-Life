import FilterIcon from '@/assets/icons/filter-icon.svg';
import Filter from '@/components/Filter/Filter';
import Searchbar from '@/components/Searchbar/Searchbar';
import { useNavbar } from '@/contexts/NavbarContext';
import { useGetListings } from '@/hooks/useGetListings';
import { useEffect, useMemo, useState } from 'react';
import styles from './ListingsPage.module.css';

const ListingsPage = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { setNavbarOverride } = useNavbar();

    useEffect(() => {
        if (isFilterOpen) {
            setNavbarOverride({
                title: 'Filteri',
                showBack: true,
                onBack: () => setIsFilterOpen(false),
            });
        } else {
            setNavbarOverride(null);
        }

        return () => {
            setNavbarOverride(null);
        };
    }, [isFilterOpen, setNavbarOverride]);

    const { listings, loading, error, pagination } = useGetListings({
        page,
        limit: 10,
        sort_by: 'created_at',
        sort_order: 'desc',
    });

    const filteredListings = useMemo(() => {
        return listings.filter((listing) =>
            listing.title.toLowerCase().includes(search.toLowerCase()),
        );
    }, [listings, search]);

    if (isFilterOpen) {
        return <Filter onClose={() => setIsFilterOpen(false)} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.filtersContainer}>
                <Searchbar value={search} onChange={setSearch} />

                <img
                    src={FilterIcon}
                    alt="Filter"
                    className={styles.filterIcon}
                    onClick={() => setIsFilterOpen(true)}
                />
            </div>

            <div className={styles.listingsContainer}>
                {loading && <span className={styles.loadingText}>Učitavanje...</span>}

                {error && <span className={styles.errorText}>{error}</span>}

                {!loading && !error && (
                    <>
                        {filteredListings.map((listing) => (
                            <div key={listing.id}>
                                <h2>{listing.title}</h2>

                                <p>{listing.company_name}</p>

                                <p>
                                    {listing.price_per_unit} € / {listing.unit}
                                </p>

                                <p>{listing.city}</p>

                                {listing.distance_km && <p>{listing.distance_km.toFixed(1)} km</p>}
                            </div>
                        ))}
                    </>
                )}
            </div>

            <div>
                <button disabled={!pagination?.prev} onClick={() => setPage((prev) => prev - 1)}>
                    Prethodna
                </button>

                <span>
                    {pagination?.page} / {pagination?.total_pages}
                </span>

                <button disabled={!pagination?.next} onClick={() => setPage((prev) => prev + 1)}>
                    Sljedeća
                </button>
            </div>
        </div>
    );
};

export default ListingsPage;
