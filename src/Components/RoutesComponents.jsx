import { Routes, Route } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import Login from "../Pages/Login";
import RegisterSeller from "../Pages/RegisterSeller";
import AdminRoute from "./routes/AdminRoute";
import User from "../Pages/User.";
import Order from "../Pages/Order";
import Notification from "../Pages/Notification";
import SellerRoute from "./routes/SellerRoute";
import Home from "../Pages/Home";
import Profiles from "../Pages/Profiles";
import Account from "../Pages/Account";
import Support from "../Pages/Support";
import Combos from "../Pages/Combos";
import Course from "../Pages/Course";
import License from "../Pages/License";
import Inventory from "../Pages/Inventory";
import Outlay from "../Pages/Outlay";
import Customer from "../Pages/Customer";
import OrderClient from "../Pages/View-client/OrderClient";
import MyProfile from "../Pages/View-client/MyProfile";
import ComboDetail from "./Inventory/combos/ComboDetail";
import OrderInternal from "../Pages/OrderInternal";

const RoutesComponents = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route index element={<Login />} />
        </Route>

        <Route path="/register-sellers" element={<PublicRoute />}>
          <Route index element={<RegisterSeller />} />
        </Route>

        <Route path="/" element={<AdminRoute />}>
          <Route path="/inicio" element={<Home />} />
          <Route path="/usuarios" element={<User />} />
          <Route path="/clientes" element={<Customer />} />
          <Route path="/inventario" element={<Inventory />} />
          <Route path="/pedidos" element={<Order />} />
          <Route path="/pedidos-internos" element={<OrderInternal />} />
          <Route path="/gastos" element={<Outlay />} />
          <Route path="/notificaciones" element={<Notification />} />

        </Route>

        <Route path="/" element={<SellerRoute />}>
          <Route index element={<Home />} />
          <Route path="/mi-perfil" element={<MyProfile />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/accounts" element={<Account />} />
          <Route path="/soporte" element={<Support />} />
          <Route path="/combos" element={<Combos />} />
          <Route path="/combos/:id" element={<ComboDetail/>} />
          <Route path="/courses" element={<Course />} />
          <Route path="/licenses" element={<License />} />
          <Route path="/pedidos-usuarios" element={<OrderClient />} />
        </Route>
      </Routes>
    </div>
  );
};

export default RoutesComponents;
