import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/auth/useAuth';
import { routes } from '@/constants/routes';

export const ProtectedRoute = () => {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) return null; // or a spinner

    if (!isLoggedIn) {
        return <Navigate to={routes.LOGIN} replace />;
    }

    return <Outlet />;
};
