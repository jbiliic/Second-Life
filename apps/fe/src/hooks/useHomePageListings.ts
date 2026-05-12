export interface HomePageListing {
    name: string;
    material_condition: string;
    quantity: number;
    unit: string;
    price_per_unit: number;
    is_available: boolean;
    image_url: string | null;
}

export interface HomePageListingsState {
    data: HomePageListing[];
    isLoading: boolean;
    error: string | null;
}

export const useHomePageListings = (): HomePageListingsState => {
    // TODO: implement data fetching
    return {
        data: [],
        isLoading: false,
        error: null,
    };
};
