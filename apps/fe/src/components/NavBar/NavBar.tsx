import { Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/constants/routes';
import styles from './Navbar.module.css';

const INITIALS = 'EP';

export default function Navbar() {
    const navigate = useNavigate();

    function handleMenuClick() {}

    function handleNotificationsClick() {}

    function handleAvatarClick() {
        navigate(routes.PROFILE);
    }

    return (
        <header className={styles.header}>
            <button
                type="button"
                className={styles.iconBtn}
                onClick={handleMenuClick}
                aria-label="Izbornik"
            >
                <Menu size={22} strokeWidth={1.5} />
            </button>

            <span className={styles.title}>SecondLife</span>

            <div className={styles.right}>
                <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={handleNotificationsClick}
                    aria-label="Obavijesti"
                >
                    <Bell size={22} strokeWidth={1.5} />
                </button>
                <div
                    className={styles.avatar}
                    onClick={handleAvatarClick}
                    role="button"
                    tabIndex={0}
                    aria-label="Profil"
                >
                    {INITIALS}
                </div>
            </div>
        </header>
    );
}
