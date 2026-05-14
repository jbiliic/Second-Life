import FilterIcon from '@/assets/icons/filter-icon.svg';
import Filter from '@/components/Filter/Filter';
import ListingCard from '@/components/ListingCard/ListingCard';
import Searchbar from '@/components/Searchbar/Searchbar';
import { useNavbar } from '@/contexts/NavbarContext';
import { useGetListings } from '@/hooks/useGetListings';
import { useEffect, useState } from 'react';
import styles from './ListingsPage.module.css';

const ListingsPage = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        location: '',

        priceMin: '',
        priceMax: '',

        quantityMin: '',
        quantityMax: '',

        condition: null as 'A' | 'B' | 'C' | null,
    });
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

        search,

        material_type: filters.category || undefined,

        condition: filters.condition || undefined,

        min_price: filters.priceMin ? Number(filters.priceMin) : undefined,

        max_price: filters.priceMax ? Number(filters.priceMax) : undefined,

        min_quantity: filters.quantityMin ? Number(filters.quantityMin) : undefined,

        sort_by: 'created_at',
        sort_order: 'desc',
    });

    // THIS WAS ONLY A MOCK FOR TESTING PAGINATION, REPLACE WITH REAL API CALL

    // const { listings, loading, error, pagination } = getMockListings(page, 5);

    // const filteredListings = useMemo(() => {
    //     return listings.filter((listing) =>
    //         listing.title.toLowerCase().includes(search.toLowerCase()),
    //     );
    // }, [listings, search]);

    if (isFilterOpen) {
        return (
            <Filter
                onClose={() => setIsFilterOpen(false)}
                onApply={(newFilters) => {
                    setFilters(newFilters);
                    setPage(1);
                }}
            />
        );
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
                        {listings.map((listing) => (
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
