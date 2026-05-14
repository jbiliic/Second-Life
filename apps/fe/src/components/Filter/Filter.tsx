import Button from '@/components/Button/Button';
import { useState } from 'react';
import styles from './Filter.module.css';

type MaterialCondition = 'A' | 'B' | 'C' | null;

type FiltersState = {
    category: string;
    location: string;

    priceMin: string;
    priceMax: string;

    quantityMin: string;
    quantityMax: string;

    weightMin: string;
    weightMax: string;

    condition: MaterialCondition;
};

type ListingFiltersProps = {
    onClose: () => void;
    onApply?: (filters: FiltersState) => void;
};

const Filter = ({ onClose, onApply }: ListingFiltersProps) => {
    const [filters, setFilters] = useState<FiltersState>({
        category: '',
        location: '',

        priceMin: '',
        priceMax: '',

        quantityMin: '',
        quantityMax: '',

        weightMin: '',
        weightMax: '',

        condition: null,
    });

    function updateField<K extends keyof FiltersState>(key: K, value: FiltersState[K]) {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    function handleApply() {
        onApply?.(filters);
        onClose();
    }

    return (
        <div className={styles.container}>
            <div className={styles.field}>
                <label className={styles.label}>Kategorija</label>
                <select
                    value={filters.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className={styles.select}
                >
                    <option value="">Sve kategorije</option>
                    <option value="plastic">Plastika</option>
                    <option value="metal">Metal</option>
                    <option value="paper">Papir</option>
                </select>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Lokacija</label>
                <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder=""
                    className={styles.input}
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Cijena</label>
                <div className={styles.range}>
                    <input
                        type="number"
                        placeholder="Min €"
                        value={filters.priceMin}
                        onChange={(e) => updateField('priceMin', e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="Max €"
                        value={filters.priceMax}
                        onChange={(e) => updateField('priceMax', e.target.value)}
                        className={styles.input}
                    />
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Količina</label>
                <div className={styles.range}>
                    <input
                        type="number"
                        placeholder="Min kom"
                        value={filters.quantityMin}
                        onChange={(e) => updateField('quantityMin', e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="Max kom"
                        value={filters.quantityMax}
                        onChange={(e) => updateField('quantityMax', e.target.value)}
                        className={styles.input}
                    />
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Kilaža</label>
                <div className={styles.range}>
                    <input
                        type="number"
                        placeholder="Min kg"
                        value={filters.weightMin}
                        onChange={(e) => updateField('weightMin', e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="Max kg"
                        value={filters.weightMax}
                        onChange={(e) => updateField('weightMax', e.target.value)}
                        className={styles.input}
                    />
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Stanje materijala</label>

                <div className={styles.range}>
                    {(['A', 'B', 'C'] as const).map((cond) => {
                        const active = filters.condition === cond;

                        return (
                            <button
                                key={cond}
                                type="button"
                                onClick={() => updateField('condition', active ? null : cond)}
                                className={styles.input}
                                style={{
                                    background: active
                                        ? 'var(--color-action-primary)'
                                        : 'transparent',
                                    color: active
                                        ? 'var(--color-text-white)'
                                        : 'var(--color-text-black)',
                                    borderColor: active
                                        ? 'var(--color-action-primary)'
                                        : 'var(--color-text-secondary)',
                                }}
                            >
                                {cond}
                            </button>
                        );
                    })}
                </div>
            </div>

            <Button
                text="Prikaži rezultate"
                onClick={() => handleApply()}
                className={styles.button}
            />
        </div>
    );
};

export default Filter;
