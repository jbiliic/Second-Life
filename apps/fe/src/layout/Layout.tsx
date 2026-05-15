import { Footer } from '@/components/Footer/Footer';
import { NavBar } from '@/components/NavBar/NavBar';
import { NavbarProvider } from '@/contexts/NavbarContext';
import { Outlet } from 'react-router-dom';
import style from './Layout.module.css';

export default function Layout() {
    return (
        <NavbarProvider>
            <div className={style.root}>
                <NavBar />

                <main className={style.main}>
                    <Outlet />
                </main>

                <Footer />
            </div>
        </NavbarProvider>
    );
}
