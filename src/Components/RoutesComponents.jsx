import { Routes, Route } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import Login from "../Pages/Login";
import RegisterSeller from "../Pages/RegisterSeller";
import AdminRoute from "./routes/AdminRoute";
import User from "../Pages/Users";
import Order from "../Pages/Order";
import Notification from "../Pages/Notification";
import SellerRoute from "./routes/SellerRoute";
import Profiles from "../Pages/Profiles";
import Account from "../Pages/Account";
import Combos from "../Pages/Combos";
import License from "../Pages/License";
import Inventory from "../Pages/Inventory";
import Customer from "../Pages/Customer";
import OrderClient from "../Pages/View-client/OrderClient";
import MyProfile from "../Pages/View-client/MyProfile";
import ComboDetail from "./Inventory/combos/ComboDetail";
import OrderInternal from "../Pages/OrderInternal";
import Success from "../Pages/View-client/Success";
import Dashboard from "../Pages/Dashboard";
import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";
import HistoryRecharge from "../Pages/HistoryRecharge";
import DailySales from "../Pages/DailySales";
import Support from "../Pages/Support";
import InventoryStock from "../Pages/InventoryStock";
import PublicKiosk from "../Pages/PublicKiosk";
import KioskSettings from "../Pages/KioskSettings";
import CardProfileBuilder from "../Pages/CardProfileBuilder";
import StoreSettings from "../Pages/StoreSettings";
import SubscriptionBlocked from "../Pages/SubscriptionBlocked";
import SubscriptionManager from "../Pages/SubscriptionManager";
import MyPlan from "../Pages/MyPlan";
import TermsAndConditions from "../Pages/TermsAndConditions";
import Privacidad from "../Pages/Privacidad";
import LandingPage from "../Pages/LandingPage/LandingPage";

import { isKioskMode } from "../utils/domain";

const RoutesComponents = () => {
  const isKiosk = isKioskMode();

  return (
    <div>
      <Routes>
        {/* Si estamos en modo Kioosco (subdominio), la raíz carga el Kiosco Público */}
        {isKiosk && <Route path="/" element={<PublicKiosk />} />}

        <Route path="/login" element={<PublicRoute />}>
          <Route index element={<Login />} />
        </Route>

        <Route path="/register-sellers" element={<PublicRoute />}>
          <Route index element={<RegisterSeller />} />
        </Route>

        <Route path="/forgot-password" element={<PublicRoute />}>
          <Route index element={<ForgotPassword />} />
        </Route>
        <Route path="/reset-password" element={<PublicRoute />}>
          <Route index element={<ResetPassword />} />
        </Route>

        <Route path="/suscripcion-vencida" element={<SubscriptionBlocked />} />
        <Route path="/terminos" element={<TermsAndConditions />} />
        <Route path="/privacidad" element={<Privacidad />} />

        {/* Landing Page */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Kiosco Público (Ruta explícita) */}
        <Route path="/k/:slug" element={<PublicKiosk />} />

        {/* Rutas de Admin y Vendedor — solo si NO estamos en modo Kiosco (subdominio) */}
        {!isKiosk && (
          <Route path="/" element={<AdminRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="/usuarios" element={<User />} />
            <Route path="/clientes" element={<Customer />} />
            {/* <Route path="/inventario" element={<Inventory />} /> */}
            <Route path="/inventario-stock" element={<InventoryStock />} />
            <Route path="/pedidos" element={<Order />} />
            <Route path="/pedidos-internos" element={<OrderInternal />} />
            <Route path="/notificaciones" element={<Notification />} />
            <Route path="/historial-recargas" element={<HistoryRecharge />} />
            <Route path="/ventas-diarias" element={<DailySales />} />
            <Route path="/constructor-cards" element={<CardProfileBuilder />} />
            <Route path="/configuracion-tienda" element={<StoreSettings />} />
            <Route path="/mi-plan" element={<MyPlan />} />
            <Route path="/suscripciones" element={<SubscriptionManager />} />
          </Route>
        )}

        {!isKiosk && (
          <Route path="/" element={<SellerRoute />}>
            <Route path="/mi-perfil" element={<MyProfile />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/accounts" element={<Account />} />
            <Route path="/soporte" element={<Support />} />
            <Route path="/mi-kiosco" element={<KioskSettings />} />
            <Route path="/combos" element={<Combos />} />
            <Route path="/combos/:id" element={<ComboDetail />} />
            <Route path="/licenses" element={<License />} />
            <Route path="/pedidos-usuarios" element={<OrderClient />} />
            <Route path="/recargacompletada" element={<Success />} />
          </Route>
        )}
      </Routes>
    </div>
  );
};

export default RoutesComponents;

