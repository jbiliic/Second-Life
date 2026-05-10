import { routes } from '@/constants/routes';
import Welcome from '@/pages/Welcome/Welcome';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.LANDING} element={<Welcome />} />
            </Routes>
        </BrowserRouter>
    );
};
