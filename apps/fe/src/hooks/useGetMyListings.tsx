import client from '@/api/client';
import { useState, useEffect } from 'react';

export type Listing = {
    id: string;
    title: string;
    quantity: number;
    unit: string;
    location: string;
    distanceKm: number;
    expiresAt: string;
    pricePerUnit: number;
    imageUrl: string;
    status: 'aktivno' | 'rezervirano' | 'nadolazeci' | 'neaktivno';
};

export type ListingFilter = 'sve' | 'aktivno' | 'neaktivno';

type UseListingsReturn = {
    listings: Listing[];
    loading: boolean;
    error: string | null;
    filter: ListingFilter;
    setFilter: (filter: ListingFilter) => void;
};

export const useListings = (): UseListingsReturn => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<ListingFilter>('sve');

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            setError(null);

            const statusParam =
                filter === 'sve' ? 'all' : filter === 'aktivno' ? 'active' : 'expired';

            const { data, error } = await client.get<Listing[]>('/listings/my', {
                params: {
                    status: statusParam,
                },
            });
            if (error || !data) {
                setError('Neuspjelo učitavanje oglasa');
                setLoading(false);
                setListings([]);
                return;
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [filter]);

    return { listings, loading, error, filter, setFilter };
};
