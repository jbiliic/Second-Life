type MockListingExtended = {
    title: string;
    material_type: string;
    condition: 'A' | 'B' | 'C';
    price_per_unit: number;
    unit: string;

    quantity: number;
    expires_at: string;

    images: {
        image_url: string;
    }[];

    company: {
        name: string;
        is_verified: boolean;
    };

    location: {
        city: string;
        street: string;
        street_number: string;
    };
};

export const mockListing: MockListingExtended = {
    title: 'Drvene palete',
    material_type: 'wood',
    condition: 'A',
    price_per_unit: 0.45,
    unit: 'kg',

    quantity: 1200,
    expires_at: '2024-12-31',

    images: [
        { image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952' },
        { image_url: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a' },
        { image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b' },
    ],

    company: {
        name: 'EcoWood',
        is_verified: true,
    },

    location: {
        city: 'Split',
        street: 'Vukovarska',
        street_number: '12',
    },
};
