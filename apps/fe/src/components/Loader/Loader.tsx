import styles from './Loader.module.css';

interface Props {
    label?: string;
}

export const Loader = ({ label = 'Učitavanje...' }: Props) => {
    return (
        <div className={styles.wrapper}>
            <span className={styles.label}>{label}</span>
            <div className={styles.spinner} />
        </div>
    );
};
