import styles from "./Stats.module.css";

interface StatsProps {
    label: string;
    value: string | number;
    subLabel?: string;
    className?: string;
}

const Stats = ({ label, value, subLabel, className = "" }: StatsProps) => {
    return (
        <div className={`${styles.card} ${className}`}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
            {subLabel && <span className={styles.subLabel}>{subLabel}</span>}
        </div>
    );
};

export default Stats;
