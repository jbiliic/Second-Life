export interface HomePageStats {
    active_listings: number;
    co2_saved_kg: number;
    profit_last_30_days: number;
}

export interface HomePageStatsState {
    data: HomePageStats | null;
    isLoading: boolean;
    error: string | null;
}

export const useHomePageStats = (): HomePageStatsState => {
    // TODO: implement data fetching
    return {
        data: null,
        isLoading: false,
        error: null,
    };
};
