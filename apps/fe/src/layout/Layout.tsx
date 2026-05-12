import { Navbar } from '@/components/NavBar/NavBar';
import { Footer } from '@/components/Footer/Footer';
import { Outlet } from 'react-router-dom';
import style from './Layout.module.css';

export default function Layout() {
    return (
        <div className={style.root}>
            <Navbar />
            <main className={style.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
