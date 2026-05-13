import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from '@/constants/routes';
import styles from './Footer.module.css';

const navItems = [
    { icon: Home, route: routes.HOME },
    { icon: Search, route: routes.LISTINGS },
    { icon: Plus, route: routes.CREATE_LISTING },
    { icon: MessageCircle, route: null },
    { icon: User, route: routes.PROFILE },
];

export const Footer = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <nav className={styles.nav}>
            {navItems.map(({ icon: Icon, route }, i) => {
                const isAdd = Icon === Plus;
                const isActive = pathname === route;
                return (
                    <button
                        key={i}
                        type="button"
                        className={`${styles.item} ${isAdd ? styles.addItem : ''} ${isActive ? styles.active : ''}`}
                        onClick={() => route && navigate(route)}
                        aria-label={isAdd ? 'Dodaj oglas' : undefined}
                    >
                        <Icon size={24} strokeWidth={1.5} />
                    </button>
                );
            })}
        </nav>
    );
};
