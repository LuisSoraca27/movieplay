import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuLeft from "../Components/MenuLeft";
import NavBar from "../Components/NavBar";
import PromoBanner from "../Components/PromoBanner";
import { useMediaQuery } from "react-responsive";
import { CartDrawer } from "../Components/Cart";

import { isKioskMode } from "../utils/domain";

export default function MainLayout({ children }) {
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 800 });
    const isKiosk = isKioskMode();
    const isKioskRoute = location.pathname.startsWith('/k/');
    const publicSettings = useSelector((state) => state.storeSettings.publicSettings);
    const user = JSON.parse(localStorage.getItem('user'));
    const isSellerInMaintenance = publicSettings?.maintenanceMode && user?.role === 'seller';

    // Routes where the layout (sidebar/navbar) should be hidden
    const hideLayout =
        location.pathname === "/login" ||
        location.pathname === "/register-sellers" ||
        location.pathname === "/forgot-password" ||
        location.pathname === "/reset-password" ||
        location.pathname === "/terminos" ||
        location.pathname === "/privacidad" ||
        location.pathname === "/landing" ||
        isKiosk || // Hide if subdomain detected
        isKioskRoute || // Hide if route is /k/...
        isSellerInMaintenance; // Fullscreen maintenance page

    if (hideLayout) {
        return <div className="h-screen w-full bg-background">{children}</div>;
    }

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden" style={{ backgroundColor: '#1C1D1F' }}>
            {/* Promo Banner - Full width at the very top */}
            <PromoBanner />

            <div className="flex flex-1 min-h-0">
                {/* Sidebar */}
                {!isMobile && <MenuLeft />}

                <div className="flex flex-col flex-1 min-w-0">
                    <NavBar />

                    {/* Main Content Area with Curved Corner */}
                    <main
                        className={`flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-default-100 shadow-inner relative ${location.pathname === '/soporte'
                            ? ''
                            : 'rounded-tl-3xl border-t-2 border-l-2 border-default-300/40'
                            }`}
                        style={{
                            boxShadow: location.pathname === '/soporte' ? 'none' : 'inset 3px 3px 12px rgba(0,0,0,0.15), -2px -2px 8px rgba(255,255,255,0.05)'
                        }}
                    >
                        {children}
                    </main>
                </div>
            </div>

            {/* Cart Drawer Modal - Global */}
            <CartDrawer />
        </div>
    );
}

