import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar';

export default function MainLayout() {


    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-6">

                <Outlet />
            </main>

        </div>
    );
};