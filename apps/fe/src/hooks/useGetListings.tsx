import client from '@/api/client';
import { useEffect, useState } from 'react';

export type Listing = {
    id: string;
    title: string;
    city: string;
    company_name: string;
    cover_image_url: string | null;
    material_type: string;
    condition: string;
    unit: string;
    price_per_unit: number;
    distance_km: number | null;
    expires_at: string | null;
};

export type ListingsResponse = {
    data: Listing[];
    page: number;
    total: number;
    total_pages: number;
    next: number | null;
    prev: number | null;
};

export type ListingsFilters = {
    page?: number;
    limit?: number;
    material_type?: string;
    condition?: string;
    listing_category?: string;
    unit?: string;
    delivery_available?: boolean;
    min_price?: number;
    max_price?: number;
    min_quantity?: number;
    max_distance_km?: number;
    sort_by?: 'price' | 'created_at' | 'distance';
    sort_order?: 'asc' | 'desc';
    lat?: number;
    lng?: number;
};

type UseListingsReturn = {
    listings: Listing[];
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        total: number;
        total_pages: number;
        next: number | null;
        prev: number | null;
    } | null;
};

export const useGetListings = (filters: ListingsFilters): UseListingsReturn => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [pagination, setPagination] = useState<UseListingsReturn['pagination']>(null);

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await client.get<ListingsResponse>('/listings', {
                params: filters,
            });

            if (error || !data) {
                setError('Neuspjelo učitavanje oglasa');
                setListings([]);
                setPagination(null);
                setLoading(false);
                return;
            }

            setListings(data.data);

            setPagination({
                page: data.page,
                total: data.total,
                total_pages: data.total_pages,
                next: data.next,
                prev: data.prev,
            });

            setLoading(false);
        };

        fetchListings();
    }, [filters]);

    return {
        listings,
        loading,
        error,
        pagination,
    };
};
