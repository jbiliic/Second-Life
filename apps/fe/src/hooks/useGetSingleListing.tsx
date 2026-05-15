import client from '@/api/client';
import { useEffect, useState } from 'react';

export type ListingImage = {
    id: string;
    image_url: string;
    is_primary: boolean;
    sort_order: number;
};

export type ListingCompany = {
    id: string;
    name: string;
    logo_url: string | null;
    is_verified: boolean;
};

export type ListingLocation = {
    city: string;
    country: string;
    street: string;
    street_number: string;
    zip: string;
    latitude: number;
    longitude: number;
};

export type ListingDetail = {
    id: string;
    title: string;
    description: string;
    material_type: string;
    condition: string;
    listing_category: string;
    quantity: number;
    unit: string;
    min_order: number;
    price_per_unit: number;
    delivery_available: boolean;
    available_until: string;
    is_recurring: boolean;
    is_active: boolean;
    created_at: string;

    company: ListingCompany;
    location: ListingLocation;
    images: ListingImage[];

    distance_km: number | null;
};

type UseListingReturn = {
    listing: ListingDetail | null;
    loading: boolean;
    error: string | null;
};

export const useGetListing = (id: string): UseListingReturn => {
    const [listing, setListing] = useState<ListingDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchListing = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await client.get<ListingDetail>(`/listings/${id}`);

            if (error || !data) {
                setError('Neuspjelo učitavanje oglasa');
                setListing(null);
                setLoading(false);
                return;
            }

            setListing(data);
            setLoading(false);
        };

        fetchListing();
    }, [id]);

    return { listing, loading, error };
};
