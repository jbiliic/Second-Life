import { useEffect, useState } from 'react';
import client from '../../api/client';
import ListingCardHomePage from '../../components/ListingCardHomePage/ListingCardHomePage';
import Stats from '../../components/Stats/Stats';
import styles from './HomePage.module.css';
import { useNavigate } from 'react-router';
import { routes } from '@/constants/routes';

interface HomePageStatItem {
    label: string;
    value: string | number;
    subLabel?: string;
}

interface HomePageListingItem {
    id: string;
    name: string;
    quantity?: number | string;
    unit: string;
    pricePerUnit: string | number;
    isAvailable: boolean;
    imageUrl?: string;
}

interface ApiActiveListings {
    active_listings: number;
}

interface ApiCo2Saved {
    co2_saved_kg: number;
}

interface ApiProfitLast30Days {
    profit_last_30_days: number;
}

interface ApiHomePageListing {
    id: string;
    name: string;
    material_condition: string;
    quantity: number;
    unit: string;
    price_per_unit: number;
    is_available: boolean;
    image_url: string | null;
}

interface HookState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}

const useActiveListings = (): HookState<ApiActiveListings> => {
    const [data, setData] = useState<ApiActiveListings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActiveListings = async () => {
            setIsLoading(true);
            const result = await client.get<ApiActiveListings>('/companies/stats/active-listings');

            if (!result.data) {
                setError(result.error ?? 'Request failed');
                setIsLoading(false);
                return;
            }

            setData(result.data);
            setError(null);
            setIsLoading(false);
        };

        fetchActiveListings();
    }, []);

    return { data, isLoading, error };
};

const useCo2Saved = (): HookState<ApiCo2Saved> => {
    const [data, setData] = useState<ApiCo2Saved | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCo2Saved = async () => {
            setIsLoading(true);
            const result = await client.get<ApiCo2Saved>('/companies/stats/co2-saved');

            if (!result.data) {
                setError(result.error ?? 'Request failed');
                setIsLoading(false);
                return;
            }

            setData(result.data);
            setError(null);
            setIsLoading(false);
        };

        fetchCo2Saved();
    }, []);

    return { data, isLoading, error };
};

const useProfitLast30Days = (): HookState<ApiProfitLast30Days> => {
    const [data, setData] = useState<ApiProfitLast30Days | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfit = async () => {
            setIsLoading(true);
            const result = await client.get<ApiProfitLast30Days>(
                '/companies/stats/profit-last-30-days',
            );

            if (!result.data) {
                setError(result.error ?? 'Request failed');
                setIsLoading(false);
                return;
            }

            setData(result.data);
            setError(null);
            setIsLoading(false);
        };

        fetchProfit();
    }, []);

    return { data, isLoading, error };
};

const useHomePageListings = (): HookState<HomePageListingItem[]> => {
    const [data, setData] = useState<HomePageListingItem[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            const result = await client.get<ApiHomePageListing[]>('/listings/home-page');

            if (!result.data) {
                setError(result.error ?? 'Request failed');
                setIsLoading(false);
                return;
            }

            const mapped = result.data.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                pricePerUnit: item.price_per_unit,
                isAvailable: item.is_available,
                imageUrl: item.image_url ?? undefined,
            }));

            setData(mapped);
            setError(null);
            setIsLoading(false);
        };

        fetchListings();
    }, []);

    return { data, isLoading, error };
};

export const HomePage = () => {
    const activeListings = useActiveListings();
    const co2Saved = useCo2Saved();
    const profitLast30Days = useProfitLast30Days();
    const listings = useHomePageListings();
    const navigate = useNavigate();

    const statsError =
        activeListings.error || co2Saved.error || profitLast30Days.error ? true : false;

    const stats: HomePageStatItem[] = [
        {
            label: 'Aktivni oglasi',
            value: activeListings.data?.active_listings ?? 0,
        },
        {
            label: 'Ustedeno CO2',
            value: `${co2Saved.data?.co2_saved_kg ?? 0} kg`,
            subLabel: 'ovaj kvartal',
        },
        {
            label: 'Prihod',
            value: `${profitLast30Days.data?.profit_last_30_days ?? 0} €`,
            subLabel: 'zadnjih 30 dana',
        },
    ];

    return (
        <div className={styles.page}>
            <section className={`${styles.section} ${styles.statsSection}`}>
                <h2 className={styles.sectionTitle}>Statistike</h2>
                <div className={styles.statsRow}>
                    {statsError ? (
                        <span className={styles.errorText}>Greska pri dohvatu statistike.</span>
                    ) : (
                        stats.map((item) => (
                            <Stats
                                key={`${item.label}-${item.value}`}
                                label={item.label}
                                value={item.value}
                                subLabel={item.subLabel}
                            />
                        ))
                    )}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Moji aktivni oglasi</h2>
                    <button
                        className={styles.linkBtn}
                        onClick={() => navigate(routes.MY_LISTINGS)}
                        type="button"
                    >
                        Vidi sve
                    </button>
                </div>
                <div className={styles.listingGrid}>
                    {listings.error ? (
                        <span className={styles.errorText}>Greska pri dohvatu oglasa.</span>
                    ) : (
                        (listings.data ?? []).map((item) => (
                            <ListingCardHomePage
                                key={`${item.id}`}
                                name={item.name}
                                quantity={item.quantity}
                                unit={item.unit}
                                pricePerUnit={item.pricePerUnit}
                                isAvailable={item.isAvailable}
                                imageUrl={item.imageUrl}
                            />
                        ))
                    )}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.infoCard}>
                    <div>
                        <h3 className={styles.cardTitle}>AI demand forecast</h3>
                        <p className={styles.cardText}>Dolazi uskoro</p>
                    </div>
                    <span className={styles.cardIcon} aria-hidden="true">
                        ↗
                    </span>
                </div>

                <div className={styles.infoCard}>
                    <div>
                        <h3 className={styles.cardTitle}>Automatski oglasi</h3>
                        <p className={styles.cardText}>
                            Svaki ponedjeljak 50 EUR paleta - sljedeci oglas 12.05
                        </p>
                    </div>
                    <button className={styles.linkBtn} type="button">
                        Upravljaj
                    </button>
                </div>
            </section>
        </div>
    );
};
