import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/protectedRoute";
import MainLayout from "../layouts/mainLayout";
import Homepage from "../pages/home/homePage";
import ProductDetails from "../pages/home/productDetails";
import AdminLayout from "../layouts/adminLayout";
import Dashboard from "../pages/home/dashboard";

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Homepage />,
            },
            {
                path: "/product/:id",
                element: <ProductDetails />,
            },
            /*
            {
                path: "/products",
                element: <ProductsPage />,
            },
            
            
            {
                path: "/cart",
                element: <CartPage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
            */
        ],

    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/admin/dashboard",
                element: <Dashboard />,
            }

        ],
    },
    {
        path: "*",
        element: <p>404 Not found</p>,
    },
]);