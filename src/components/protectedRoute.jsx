import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, userRole, isLoading } = useSelector(
        (state) => state.auth
    );

    if (isLoading) {
        return <div className="h-screen w-full"></div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
};