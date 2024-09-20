import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export default function AdminRoute() {
    const { isAuthenticated, userAuth } = useAuthContext();

    const role = userAuth.role;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (role !== "admin") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}