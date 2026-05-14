import type { Listing, ListingsResponse } from '@/hooks/useGetListings';

const allMockListings: Listing[] = [
    {
        id: '1',
        title: 'Drvene palete',
        city: 'Split',
        company_name: 'EcoWood',
        cover_image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
        material_type: 'WOOD',
        condition: 'USED',
        unit: 'kg',
        price_per_unit: 0.45,
        distance_km: 2.4,
    },
    {
        id: '2',
        title: 'PVC granulat',
        city: 'Zagreb',
        company_name: 'Plastik ReUse',
        cover_image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b',
        material_type: 'PLASTIC',
        condition: 'NEW',
        unit: 'kg',
        price_per_unit: 1.2,
        distance_km: 8.1,
    },
    {
        id: '3',
        title: 'Metalni otpad',
        city: 'Rijeka',
        company_name: 'Metal Solutions',
        cover_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        material_type: 'METAL',
        condition: 'USED',
        unit: 't',
        price_per_unit: 180,
        distance_km: 14.7,
    },
    {
        id: '4',
        title: 'Kartonska ambalaža',
        city: 'Osijek',
        company_name: 'GreenPack',
        cover_image_url: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
        material_type: 'PAPER',
        condition: 'USED',
        unit: 'kg',
        price_per_unit: 0.2,
        distance_km: 5.6,
    },
    {
        id: '5',
        title: 'Staklene boce',
        city: 'Zadar',
        company_name: 'GlassCycle',
        cover_image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
        material_type: 'GLASS',
        condition: 'USED',
        unit: 'kom',
        price_per_unit: 0.1,
        distance_km: 11.2,
    },
    {
        id: '6',
        title: 'Aluminijske limenke',
        city: 'Šibenik',
        company_name: 'AluTrade',
        cover_image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
        material_type: 'METAL',
        condition: 'USED',
        unit: 'kg',
        price_per_unit: 0.95,
        distance_km: 6.8,
    },
    {
        id: '7',
        title: 'Tekstilni višak',
        city: 'Dubrovnik',
        company_name: 'Textile Hub',
        cover_image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        material_type: 'TEXTILE',
        condition: 'NEW',
        unit: 'kg',
        price_per_unit: 2.5,
        distance_km: 19.3,
    },
    {
        id: '8',
        title: 'Industrijska plastika',
        city: 'Karlovac',
        company_name: 'RePlast',
        cover_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        material_type: 'PLASTIC',
        condition: 'USED',
        unit: 't',
        price_per_unit: 240,
        distance_km: 23.5,
    },
];

export const getMockListings = (page: number = 1, limit: number = 4): ListingsResponse => {
    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedListings = allMockListings.slice(start, end);

    const total = allMockListings.length;
    const total_pages = Math.ceil(total / limit);

    return {
        data: paginatedListings,
        page,
        total,
        total_pages,
        next: page < total_pages ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
    };
};
