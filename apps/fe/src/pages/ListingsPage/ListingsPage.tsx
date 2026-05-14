import Searchbar from '@/components/Searchbar/Searchbar';
import { useGetListings } from '@/hooks/useGetListings';
import { useMemo, useState } from 'react';

const ListingsPage = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

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

    return (
        <div>
            <h1>Oglasi</h1>

            <Searchbar value={search} onChange={setSearch} />

            <div>
                {loading && <p>Učitavanje...</p>}

                {error && <p>{error}</p>}

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
