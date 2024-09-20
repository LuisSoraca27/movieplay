import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export default function PublicRoute() {

    const location = useLocation();
    const { isAuthenticated } = useAuthContext();

    if (isAuthenticated && location.pathname === "/login") {
        return <Navigate to="/" />;
    }

    if (isAuthenticated && location.pathname !== "register-sellers") {
        return <Navigate to="/" />;

    }

    return <Outlet />;
}