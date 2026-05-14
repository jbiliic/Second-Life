import SearchIcon from '@/assets/icons/search-icon.svg';
import type { ChangeEvent } from 'react';
import styles from './Searchbar.module.css';

type SearchbarProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

const Searchbar = ({
    value,
    onChange,
    placeholder = 'Pretraži materijale, lokacije...',
}: SearchbarProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={styles.searchbar}>
            <img src={SearchIcon} alt="Search" className={styles.icon} />

            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={styles.input}
            />
        </div>
    );
};

export default Searchbar;
