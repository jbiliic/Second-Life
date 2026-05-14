import FilterIcon from '@/assets/icons/filter-icon.svg';
import Filter from '@/components/Filter/Filter';
import ListingCard from '@/components/ListingCard/ListingCard';
import Searchbar from '@/components/Searchbar/Searchbar';
import { getMockListings } from '@/constants/listings.mock';
import { useNavbar } from '@/contexts/NavbarContext';
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

    // const { listings, loading, error, pagination } = useGetListings({
    //     page,
    //     limit: 10,
    //     sort_by: 'created_at',
    //     sort_order: 'desc',
    // });

    const { listings, loading, error, pagination } = getMockListings(page, 5);

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
                            <ListingCard
                                key={listing.id}
                                id={listing.id}
                                title={listing.title}
                                condition={listing.condition}
                                quantity={0}
                                unit={listing.unit}
                                location={listing.city}
                                distanceKm={listing.distance_km ?? 0}
                                expiresAt={listing.expires_at ?? ''}
                                pricePerUnit={listing.price_per_unit}
                                imageUrl={listing.cover_image_url ?? ''}
                            />
                        ))}
                    </>
                )}
            </div>

            <div className={styles.paginationContainer}>
                <button
                    disabled={!pagination?.prev}
                    onClick={() => setPage((prev) => prev - 1)}
                    className={styles.paginationButton}
                >
                    Prethodna
                </button>

                <span>
                    {pagination?.page} / {pagination?.total_pages}
                </span>

                <button
                    disabled={!pagination?.next}
                    onClick={() => setPage((prev) => prev + 1)}
                    className={styles.paginationButton}
                >
                    Sljedeća
                </button>
            </div>
        </div>
    );
};

export default ListingsPage;
