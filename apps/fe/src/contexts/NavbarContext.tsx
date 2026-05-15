import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

export type NavbarOverride = {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
};

type NavbarContextType = {
    navbarOverride: NavbarOverride | null;
    setNavbarOverride: (value: NavbarOverride | null) => void;
};

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

type NavbarProviderProps = {
    children: ReactNode;
};

export const NavbarProvider = ({ children }: NavbarProviderProps) => {
    const [navbarOverride, setNavbarOverride] = useState<NavbarOverride | null>(null);

    const value = useMemo(
        () => ({
            navbarOverride,
            setNavbarOverride,
        }),
        [navbarOverride],
    );

    return <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>;
};

export const useNavbar = () => {
    const context = useContext(NavbarContext);

    if (!context) {
        throw new Error('useNavbar must be used inside NavbarProvider');
    }

    return context;
};
