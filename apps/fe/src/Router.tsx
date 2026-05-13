import { routes } from '@/constants/routes';
import Welcome from '@/pages/Welcome/Welcome';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/LogInPage/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswPage/ForgotPasswordPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import Layout from './layout/Layout';
import { HomePage } from './pages/HomePage/HomePage';
import { MyListingsPage } from './pages/MyListingsPage/MyListingsPage';

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.LANDING} element={<Welcome />} />
                <Route path={routes.LOGIN} element={<Login />} />
                <Route path={routes.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                <Route path={routes.REGISTER} element={<RegisterPage />} />

                <Route element={<Layout />}>
                    <Route path={routes.HOME} element={<HomePage />} />
                    <Route path={routes.MY_LISTINGS} element={<MyListingsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
