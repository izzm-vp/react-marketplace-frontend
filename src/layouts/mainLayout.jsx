import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/navbar';
import { fetchUserCart } from '../store/cart/cartActions';
import { useEffect } from 'react';

export default function MainLayout() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        if (user?.roles?.includes('ROLE_ADMIN')) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);


    useEffect(() => {
        const initMainLayout = async () => {
            try {
                await dispatch(fetchUserCart()).unwrap();
            } catch (error) {
                console.error('Failed to fetch user cart:', error);
            }
        };
        initMainLayout();
    }, [dispatch]);


    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
};
