import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/protectedRoute";
import  MainLayout  from "../layouts/mainLayout";
import Homepage from "../pages/home/homePage";
import ProductDetails from "../pages/home/productDetails";

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
            {
                path: "/user",
                element: <ProtectedRoute allowedRoles={['ROLE_USER']} />,
                children: [
                    {
                        path: "profile",
                        element: <UserProfilePage />,
                    },
                    {
                        path: "orders",
                        element: <UserOrdersPage />,
                    },
                ],
            },
            */
        ],
    },
    /*
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <AdminDashboard />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
    */
]);