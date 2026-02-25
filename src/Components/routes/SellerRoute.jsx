import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthContext } from "../../context/AuthContext";
import { Wrench } from "lucide-react";

export default function SellerRoute() {
    const { isAuthenticated } = useAuthContext();
    const publicSettings = useSelector((state) => state.storeSettings.publicSettings);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Modo mantenimiento: solo afecta a sellers (los admins usan AdminRoute)
    if (publicSettings?.maintenanceMode) {
        const message = publicSettings.maintenanceMessage || 'Estamos realizando mejoras. Vuelve pronto.';

        return (
            <div className="min-h-screen flex items-center justify-center bg-[#141517] px-4">
                <div className="max-w-md w-full text-center">
                    {/* Icon */}
                    <div className="mx-auto w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8">
                        <Wrench size={36} className="text-amber-400" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
                        En Mantenimiento
                    </h1>

                    {/* Subtitle */}
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6">
                        Volveremos pronto
                    </p>

                    {/* Message */}
                    <div className="rounded-2xl border border-white/[0.06] bg-[#1C1D1F]/60 backdrop-blur-xl p-6">
                        <p className="text-white/60 text-sm leading-relaxed font-medium">
                            {message}
                        </p>
                    </div>

                    {/* Animated dots */}
                    <div className="flex items-center justify-center gap-1.5 mt-8">
                        <span className="w-2 h-2 rounded-full bg-amber-400/60 animate-pulse" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-amber-400/40 animate-pulse" style={{ animationDelay: '300ms' }} />
                        <span className="w-2 h-2 rounded-full bg-amber-400/20 animate-pulse" style={{ animationDelay: '600ms' }} />
                    </div>
                </div>
            </div>
        );
    }

    return <Outlet />;
}