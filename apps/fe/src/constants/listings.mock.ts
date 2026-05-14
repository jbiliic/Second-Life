import type { Listing } from '@/hooks/useGetListings';

type MockUseGetListingsResponse = {
    listings: Listing[];
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        total: number;
        total_pages: number;
        next: number | null;
        prev: number | null;
    };
};

const allMockListings: Listing[] = [
    {
        id: '1',
        title: 'Drvene palete',
        city: 'Split',
        company_name: 'EcoWood',
        cover_image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
        material_type: 'wood',
        condition: 'A',
        unit: 'kg',
        price_per_unit: 0.45,
        distance_km: 2.4,
        expires_at: '2024-12-31',
    },
    {
        id: '2',
        title: 'PVC granulat',
        city: 'Zagreb',
        company_name: 'Plastik ReUse',
        cover_image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b',
        material_type: 'plastic',
        condition: 'B',
        unit: 'kg',
        price_per_unit: 1.2,
        distance_km: 8.1,
        expires_at: '2024-11-30',
    },
    {
        id: '3',
        title: 'Metalni otpad',
        city: 'Rijeka',
        company_name: 'Metal Solutions',
        cover_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        material_type: 'metal',
        condition: 'C',
        unit: 'T',
        price_per_unit: 180,
        distance_km: 14.7,
        expires_at: '2024-10-15',
    },
    {
        id: '4',
        title: 'Kartonska ambalaža',
        city: 'Osijek',
        company_name: 'GreenPack',
        cover_image_url: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
        material_type: 'cardboard',
        condition: 'A',
        unit: 'kg',
        price_per_unit: 0.2,
        distance_km: 5.6,
        expires_at: '2024-09-30',
    },
    {
        id: '5',
        title: 'Staklene boce',
        city: 'Zadar',
        company_name: 'GlassCycle',
        cover_image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
        material_type: 'glass',
        condition: 'B',
        unit: 'kom',
        price_per_unit: 0.1,
        distance_km: 11.2,
        expires_at: '2024-08-31',
    },
    {
        id: '6',
        title: 'Aluminijske limenke',
        city: 'Šibenik',
        company_name: 'AluTrade',
        cover_image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
        material_type: 'metal',
        condition: 'A',
        unit: 'kg',
        price_per_unit: 0.95,
        distance_km: 6.8,
        expires_at: '2024-07-31',
    },
    {
        id: '7',
        title: 'Reciklirani papir',
        city: 'Dubrovnik',
        company_name: 'Textile Hub',
        cover_image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        material_type: 'cardboard',
        condition: 'C',
        unit: 'kg',
        price_per_unit: 2.5,
        distance_km: 19.3,
        expires_at: '2024-06-30',
    },
    {
        id: '8',
        title: 'Industrijska plastika',
        city: 'Karlovac',
        company_name: 'RePlast',
        cover_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        material_type: 'plastic',
        condition: 'B',
        unit: 'T',
        price_per_unit: 240,
        distance_km: 23.5,
        expires_at: '2024-05-31',
    },
];

export const getMockListings = (
    page: number = 1,
    limit: number = 10,
): MockUseGetListingsResponse => {
    const start = (page - 1) * limit;
    const end = start + limit;

    const listings = allMockListings.slice(start, end);

    const total = allMockListings.length;
    const total_pages = Math.ceil(total / limit);

    return {
        listings,
        loading: false,
        error: null,
        pagination: {
            page,
            total,
            total_pages,
            next: page < total_pages ? page + 1 : null,
            prev: page > 1 ? page - 1 : null,
        },
    };
};
