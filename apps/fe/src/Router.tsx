import { routes } from '@/constants/routes';
import Welcome from '@/pages/Welcome/Welcome';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/LogInPage/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswPage/ForgotPasswordPage';

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.LANDING} element={<Welcome />} />
                <Route path={routes.LOGIN} element={<Login />} />
                <Route path={routes.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                {/* <Route path={routes.REGISTER} element={<RegisterPage />} /> */}
            </Routes>
        </BrowserRouter>
    );
};
