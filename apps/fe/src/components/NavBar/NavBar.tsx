import { routes } from '@/constants/routes';
import { useNavbar } from '@/contexts/NavbarContext';
import { useAuth } from '@/providers/auth/useAuth';
import { ArrowLeft, Bell, Menu } from 'lucide-react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';

type NavbarConfig = {
    title: string;
    showBack: boolean;
    titleClass?: string;
};

const navbarConfig: Record<string, NavbarConfig> = {
    [routes.LISTING_DETAIL]: { title: 'Detalji', showBack: true },
    [routes.HOME]: { title: 'SecondLife', showBack: false, titleClass: styles.titleGreen },
    [routes.LISTINGS]: { title: 'Pretraži', showBack: false },
    [routes.MY_LISTINGS]: { title: 'Moji oglasi', showBack: false },
    [routes.CREATE_LISTING]: { title: 'Novi oglas', showBack: true },
    [routes.PROFILE]: { title: 'Profil', showBack: false },
};

const DEFAULT_CONFIG: NavbarConfig = {
    title: 'SecondLife',
    showBack: false,
};

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

    const { navbarOverride } = useNavbar();

    const routeConfig =
        Object.entries(navbarConfig).find(([path]) => matchPath(path, pathname))?.[1] ??
        DEFAULT_CONFIG;

    const config = {
        ...routeConfig,
        ...navbarOverride,
    };

    function handleLeftClick() {
        if (config.showBack && config.onBack) {
            config.onBack();
            return;
        }

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

            <span className={`${styles.title} ${config.titleClass ?? ''}`}>{config.title}</span>

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
