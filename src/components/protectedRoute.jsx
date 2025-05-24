import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, isLoading } = useSelector(
        (state) => state.auth
    );

    if (isLoading) {
        return <div className="h-screen w-full flex justify-center items-center">
            <Loader className="size-10 text-indigo-500 animate-spin"/>
        </div>;
    }

    if (!isAuthenticated || !user?.roles?.some(role => allowedRoles.includes(role))) {
        return <Navigate to="/" replace />;
    }


    return children;
};