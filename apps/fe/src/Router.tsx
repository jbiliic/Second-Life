import { routes } from '@/constants/routes';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import ForgotPasswordPage from './pages/ForgotPasswPage/ForgotPasswordPage';
import { HomePage } from './pages/HomePage/HomePage';
import ListingDetailPage from './pages/ListingDetail/ListingDetailPage';
import ListingsPage from './pages/ListingsPage/ListingsPage';
import Login from './pages/LogInPage/LoginPage';
import { MyListingsPage } from './pages/MyListingsPage/MyListingsPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import WelcomePage from './pages/WelcomePage/WelcomePage';

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.LANDING} element={<WelcomePage />} />
                <Route path={routes.LOGIN} element={<Login />} />
                <Route path={routes.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                <Route path={routes.REGISTER} element={<RegisterPage />} />

                <Route element={<Layout />}>
                    <Route path={routes.HOME} element={<HomePage />} />
                    <Route path={routes.MY_LISTINGS} element={<MyListingsPage />} />
                    <Route path={routes.LISTINGS} element={<ListingsPage />} />
                    <Route path={routes.LISTING_DETAIL} element={<ListingDetailPage />} />
                    <Route path={routes.NOTFOUND} element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
