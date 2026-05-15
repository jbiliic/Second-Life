import { createContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import client from '../../api/client';

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    companyName: string | null;
    login: (token: string, companyName: string) => void;
    logout: () => void;
}

interface AuthResponse {
    companyName: string;
    token?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [companyName, setCompanyName] = useState<string | null>(null);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
        setCompanyName(null);
        setIsLoading(false);
    }, []);

    const login = useCallback((token: string, name: string) => {
        localStorage.setItem('access_token', token);
        setIsLoggedIn(true);
        setCompanyName(name);
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            const { data, error } = await client.get<AuthResponse>('/auth/validate');

            if (error) {
                logout();
            } else if (data) {
                setIsLoggedIn(true);
                setCompanyName(data.companyName);
                if (data.token) localStorage.setItem('access_token', data.token);
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, [logout]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, companyName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
