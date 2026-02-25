import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const GRACE_DAYS = 2;

export default function AdminRoute() {
    const { isAuthenticated, userAuth } = useAuthContext();

    const role = userAuth?.role;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (role !== "admin" && role !== "superadmin") {
        return <Navigate to="/profiles" />;
    }

    if (role === "admin") {
        const blocked = localStorage.getItem("subscriptionBlocked") === "true";
        if (blocked) {
            return <Navigate to="/suscripcion-vencida" />;
        }

        const subscription = JSON.parse(localStorage.getItem("subscription") || "null");
        if (!subscription) {
            return <Navigate to="/suscripcion-vencida" />;
        }

        if (subscription.status === "suspended") {
            return <Navigate to="/suscripcion-vencida" />;
        }

        const endDate = new Date(subscription.endDate);
        const graceLimit = new Date(endDate);
        graceLimit.setDate(graceLimit.getDate() + GRACE_DAYS);

        if (new Date() > graceLimit) {
            return <Navigate to="/suscripcion-vencida" />;
        }
    }

    return <Outlet />;
}
