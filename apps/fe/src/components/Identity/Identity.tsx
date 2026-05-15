import logo from '@/assets/icons/secondlife-logo-green.svg';
import styles from '@/components/Identity/Identity.module.css';

const Identity = () => {
    return (
        <div className={styles.container}>
            <img src={logo} alt="SecondLife Logo" className={styles.logo} />
            <h3 className={styles.title}>SecondLife. First Choice</h3>
        </div>
    );
};

export default Identity;
