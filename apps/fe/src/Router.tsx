import { routes } from '@/constants/routes';
import Welcome from '@/pages/Welcome/Welcome';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/LogInPage/LoginPage';

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.LANDING} element={<Welcome />} />
                <Route path={routes.LOGIN} element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};
