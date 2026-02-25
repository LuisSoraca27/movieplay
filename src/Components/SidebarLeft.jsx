import { Button, Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";
import {
  LayoutDashboard, Bell, Home, Users, History, Package, ShoppingCart,
  BarChart3, Info, User as UserIcon, Power, ChevronRight, CreditCard, Layers, Settings, Store
} from "lucide-react";

// eslint-disable-next-line react/prop-types
const SidebarLeft = ({ visible, onHide }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthContext();
  const user = JSON.parse(localStorage.getItem("user"));
  const publicSettings = useSelector((state) => state.storeSettings.publicSettings);
  const storeLogo = publicSettings?.logo || logo;

  const itemsAdmin = [
    { label: "Dashboard", icon: LayoutDashboard, link: "/" },
    { label: "Notificaciones", icon: Bell, link: "/notificaciones" },
    { label: "Usuarios", icon: Users, link: "/usuarios" },
    { label: "Clientes", icon: Users, link: "/clientes" },
    { label: "Historial de recargas", icon: History, link: "/historial-recargas" },
    { label: "Inventario Stock", icon: Package, link: "/inventario-stock" },
    { label: "Constructor Cards", icon: Layers, link: "/constructor-cards" },
    { label: "Ventas internas", icon: ShoppingCart, link: "/pedidos-internos" },
    { label: "Ventas externas", icon: ShoppingCart, link: "/pedidos" },
    { label: "Ventas diarias", icon: BarChart3, link: "/ventas-diarias" },
    { label: "Config. Tienda", icon: Settings, link: "/configuracion-tienda" },
    { label: "Mi Plan", icon: CreditCard, link: "/mi-plan" },
    { label: "Soporte", icon: Info, link: "/soporte" },
  ];

  const itemsSuperAdmin = [
    ...itemsAdmin.filter((item) => item.link !== "/mi-plan"),
    { label: "Suscripciones", icon: CreditCard, link: "/suscripciones" },
  ];

  const itemsSeller = [
    { label: "Inicio", icon: Home, link: "/" },
    { label: "Mi cuenta", icon: UserIcon, link: "/mi-perfil" },
    { label: "Mi Kiosco", icon: Store, link: "/mi-kiosco" },
    { label: "Mis pedidos", icon: ShoppingCart, link: "/pedidos-usuarios" },
    { label: "Soporte", icon: Info, link: "/soporte" },
  ];

  const menuItems = user?.role === "superadmin" ? itemsSuperAdmin : user?.role === "admin" ? itemsAdmin : itemsSeller;

  const handleNavigate = (path) => {
    onHide();
    navigate(path);
  };

  const userInitial = user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <Drawer
      isOpen={visible}
      onClose={onHide}
      placement="left"
      size="xs"
      classNames={{
        base: "bg-[#1C1D1F]",
        header: "border-b border-white/[0.06]",
        footer: "border-t border-white/[0.06]",
        closeButton: "text-white/40 hover:text-white hover:bg-white/10 rounded-xl",
      }}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="justify-center py-7">
              <img src={storeLogo} alt="Logo" className="w-28 h-auto object-contain" />
            </DrawerHeader>

            <DrawerBody className="px-3 py-4">
              <ul className="space-y-1">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.link;
                  return (
                    <li key={index}>
                      <button
                        onClick={() => handleNavigate(item.link)}
                        className={`
                          w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all duration-300 group
                          ${isActive
                            ? "bg-white/[0.08] text-white"
                            : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                          }
                        `}
                      >
                        <div className={`
                          p-2 rounded-xl transition-all duration-300
                          ${isActive
                            ? "bg-white/10 shadow-lg shadow-white/[0.03]"
                            : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                          }
                        `}>
                          <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={`text-[13px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                          {item.label}
                        </span>
                        {isActive && (
                          <ChevronRight size={14} className="ml-auto text-white/30" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </DrawerBody>

            <DrawerFooter className="flex flex-col gap-4 px-4 py-5">
              {/* User Card */}
              <div className="flex items-center gap-3 w-full px-3 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <span className="text-white text-sm font-black">{userInitial}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-white tracking-wide">{user?.username}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
                    {user?.role === "superadmin" ? "Super Admin" : user?.role === "admin" ? "Administrador" : "Aliado"}
                  </span>
                </div>
              </div>

              <Button
                variant="flat"
                onPress={logout}
                startContent={<Power size={16} />}
                className="w-full h-11 rounded-2xl bg-red-500/10 text-red-400 font-bold text-[11px] uppercase tracking-wider hover:bg-red-500/20 transition-all border border-red-500/10"
              >
                Cerrar Sesión
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default SidebarLeft;
