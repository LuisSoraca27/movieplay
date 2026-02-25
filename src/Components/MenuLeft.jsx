import { Button, Tooltip } from "@heroui/react";
import logo from "../assets/logo.png";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  LayoutDashboard, Bell, Users, History, Table, Package, ShoppingCart,
  BarChart3, Info, Home, User, Power, ChevronRight, ChevronLeft, Store, Layers, Settings, CreditCard
} from 'lucide-react';

export default function MenuLeft() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthContext();
  const publicSettings = useSelector((state) => state.storeSettings.publicSettings);
  const storeLogo = publicSettings?.logo || logo;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const userInitial = user?.username?.charAt(0)?.toUpperCase() || "U";

  const itemsAdmin = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Notificaciones", icon: Bell, path: "/notificaciones" },
    { label: "Usuarios", icon: Users, path: "/usuarios" },
    { label: "Clientes", icon: Users, path: "/clientes" },
    { label: "Historial de recargas", icon: History, path: "/historial-recargas" },
    // { label: "Inventario", icon: Table, path: "/inventario" },
    { label: "Inventario Stock", icon: Package, path: "/inventario-stock" },
    { label: "Constructor Cards", icon: Layers, path: "/constructor-cards" },
    { label: "Ventas internas", icon: ShoppingCart, path: "/pedidos-internos" },
    { label: "Ventas externas", icon: ShoppingCart, path: "/pedidos" },
    { label: "Ventas diarias", icon: BarChart3, path: "/ventas-diarias" },
    { label: "Config. Tienda", icon: Settings, path: "/configuracion-tienda" },
    { label: "Mi Plan", icon: CreditCard, path: "/mi-plan" },
    { label: "Soporte", icon: Info, path: "/soporte" },
  ];

  const itemsSuperAdmin = [
    ...itemsAdmin.filter((item) => item.path !== "/mi-plan"),
    { label: "Suscripciones", icon: CreditCard, path: "/suscripciones" },
  ];

  const itemsSeller = [
    { label: "Inicio", icon: Home, path: "/" },
    { label: "Mi cuenta", icon: User, path: "/mi-perfil" },
    { label: "Mi Kiosco", icon: Store, path: "/mi-kiosco" },
    { label: "Mis pedidos", icon: ShoppingCart, path: "/pedidos-usuarios" },
    { label: "Soporte", icon: Info, path: "/soporte" },
  ];

  const getMenuItems = () => {
    if (user?.role === "superadmin") return itemsSuperAdmin;
    if (user?.role === "admin") return itemsAdmin;
    return itemsSeller;
  };

  const menuItems = getMenuItems();

  const isActive = (path) => location.pathname === path;

  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    const content = (
      <button
        className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-2xl transition-all duration-300 group
          ${active
            ? 'bg-white/[0.08] text-white'
            : 'text-white/50 hover:bg-white/[0.05] hover:text-white'}
          ${isCollapsed ? 'justify-center p-2' : ''}
        `}
        onClick={() => navigate(item.path)}
      >
        <div className={`
          p-2 rounded-xl transition-all duration-300 flex-shrink-0
          ${active
            ? 'bg-white/10 shadow-lg shadow-white/[0.03]'
            : 'bg-white/[0.04] group-hover:bg-white/[0.08]'}
        `}>
          <Icon
            size={17}
            strokeWidth={active ? 2.5 : 2}
          />
        </div>
        {!isCollapsed && (
          <span className={`text-[11px] uppercase tracking-wider truncate ${active ? 'font-bold' : 'font-medium'}`}>
            {item.label}
          </span>
        )}
        {!isCollapsed && active && (
          <ChevronRight size={14} className="ml-auto text-white/30 flex-shrink-0" />
        )}
      </button>
    );

    if (isCollapsed) {
      return (
        <Tooltip content={item.label} placement="right" color="primary">
          {content}
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <div
      className={`h-full border-none flex flex-col transition-all duration-300 ease-in-out sticky top-0 relative z-20
        ${isCollapsed ? "w-20" : "w-64"}
      `}
      style={{ backgroundColor: '#1C1D1F' }}
    >
      {/* Logo */}
      <div className={`flex flex-col items-center justify-center py-6 px-4 ${isCollapsed ? 'mb-2' : ''}`}>
        <img
          src={storeLogo}
          alt="logo"
          className={`transition-all duration-300 object-contain ${isCollapsed ? 'w-10 h-10' : 'w-28 h-auto'}`}
        />
      </div>

      {/* Toggle Button */}
      <div className="absolute -right-3 top-8 z-50">
        <Button
          isIconOnly
          size="sm"
          radius="full"
          className="bg-[#2a2b2e] border border-white/[0.06] shadow-md min-w-6 w-6 h-6 text-white hover:bg-white/10 transition-all"
          onPress={toggleCollapse}
          aria-label={isCollapsed ? "Expandir" : "Colapsar"}
        >
          {isCollapsed ? <ChevronRight size={14} className="text-default-500" /> : <ChevronLeft size={14} className="text-default-500" />}
        </Button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-1 scrollbar-hide">
        {menuItems.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.06]" style={{ backgroundColor: '#1C1D1F' }}>
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            <Tooltip content={user?.username || "Usuario"} placement="right">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shadow-lg shadow-indigo-500/20 cursor-default">
                <span className="text-white text-sm font-black">{userInitial}</span>
              </div>
            </Tooltip>
            <Tooltip content="Cerrar Sesión" placement="right">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={logout}
                className="rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/10"
              >
                <Power size={16} />
              </Button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* User Card */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-black">{userInitial}</span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[13px] font-bold text-white tracking-wide truncate">{user?.username}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
                  {user?.role === "superadmin" ? "Super Admin" : user?.role === "admin" ? "Administrador" : "Aliado"}
                </span>
              </div>
            </div>

            <Button
              variant="flat"
              onPress={logout}
              startContent={<Power size={16} />}
              className="w-full h-10 rounded-2xl bg-red-500/10 text-red-400 font-bold text-[11px] uppercase tracking-wider hover:bg-red-500/20 transition-all border border-red-500/10"
            >
              Cerrar Sesión
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
