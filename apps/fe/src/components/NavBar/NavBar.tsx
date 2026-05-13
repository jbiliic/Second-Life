import { Menu, Bell, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from '@/constants/routes';
import styles from './NavBar.module.css';
import { useAuth } from '@/providers/auth/useAuth';

type NavbarConfig = {
    title: string;
    showBack: boolean;
};

const navbarConfig: Record<string, NavbarConfig> = {
    [routes.HOME]: { title: 'SecondLife', showBack: false },
    [routes.LISTINGS]: { title: 'Moji oglasi', showBack: false },
    [routes.MY_LISTINGS]: { title: 'Moji oglasi', showBack: false },
    [routes.CREATE_LISTING]: { title: 'Novi oglas', showBack: true },
    [routes.PROFILE]: { title: 'Profil', showBack: false },
};

const DEFAULT_CONFIG: NavbarConfig = { title: 'SecondLife', showBack: false };

export const NavBar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { companyName } = useAuth();

    const initials = companyName
        ? companyName
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
        : '?';

    const config = navbarConfig[pathname] ?? DEFAULT_CONFIG;

    function handleLeftClick() {
        if (config.showBack) {
            navigate(-1);
        }
    }

    function handleNotificationsClick() {}

    function handleAvatarClick() {
        navigate(routes.PROFILE);
    }

    return (
        <header className={styles.header}>
            <button
                type="button"
                className={styles.iconBtn}
                onClick={handleLeftClick}
                aria-label={config.showBack ? 'Natrag' : 'Izbornik'}
            >
                {config.showBack ? (
                    <ArrowLeft size={22} strokeWidth={1.5} />
                ) : (
                    <Menu size={24} strokeWidth={1.5} />
                )}
            </button>

            <span className={styles.title}>{config.title}</span>

            <div className={styles.right}>
                <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={handleNotificationsClick}
                    aria-label="Obavijesti"
                >
                    <Bell size={18} strokeWidth={1.5} />
                </button>
                <div
                    className={styles.avatar}
                    onClick={handleAvatarClick}
                    role="button"
                    tabIndex={0}
                    aria-label="Profil"
                >
                    {initials}
                </div>
            </div>
        </header>
    );
};
