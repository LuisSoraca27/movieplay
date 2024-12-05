import { Menu } from "primereact/menu";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import logo from "../assets/logo.png";
import "../style/menuLeft.css";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MenuLeft() {

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const { logout,  } = useAuthContext();

  const itemRenderer = (item) => (
    <div className="p-menuitem-content" onClick={() => item.command()}>
    <a className="p-menuitem-link p-menuitem-link-menu">
      <span className={`${item.icon} p-menuitem-icon p-menuitem-icon-menu`} />
      <span className="menu-link menu-link-menu">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
    </a>
  </div>
  );

  const itemsAdmin = [
    {
      label: "Dashboard",
      icon: "pi pi-chart-pie",
      command: () => navigate("/"),
      template: itemRenderer,

    },
    {
      label: "Notificaciones",
      icon: "pi pi-bell",
      command: () => navigate("/notificaciones"),
      template: itemRenderer,
    },
    {
      label: "Usuarios",
      icon: "pi pi-users",
      command: () => navigate("/usuarios"),
      template: itemRenderer,
    },
    {
      label: "Clientes",
      icon: "pi pi-users",
      command: () => navigate("/clientes"),
      template: itemRenderer,
    },
    {
      label: "Inventario",
      icon: "pi pi-box",
      command: () => navigate("/inventario"),
      template: itemRenderer,
    },
    {
      label: "Ventas internas",
      icon: "pi pi-shopping-cart",
      command: () => navigate("/pedidos-internos"),
      template: itemRenderer,
    },
    {
      label: "Ventas externas",
      icon: "pi pi-shopping-cart",
      command: () => navigate("/pedidos"),
      template: itemRenderer,
    },
    {
      label: "Gastos",
      icon: "pi pi-money-bill",
      command: () => navigate("/gastos"),
      template: itemRenderer,
    },
    {
      label: "Soporte",
      icon: "pi pi-info-circle",
      command: () => navigate("/soporte"),
      template: itemRenderer,
    },
  ]

  const itemsSeller = [

    {
      label: "Inicio",
      icon: "pi pi-home",
      command: () => navigate("/"),
      template: itemRenderer,
    },
    {
      label: "Mi cuenta",
      icon: "pi pi-user",
      command: () => navigate("/mi-perfil"),
      template: itemRenderer,
    },
    {
      label: "Mis pedidos",
      icon: "pi pi-shopping-cart",
      command: () => navigate("/pedidos-usuarios"),
      template: itemRenderer,
    },
    {
      label: "Soporte",
      icon: "pi pi-info-circle",
      command: () => navigate("/soporte"),
      template: itemRenderer,
    },
  ]


  let items = [
    {
      template: () => {
        return (
          <span className="container-logo">
            <img src={logo} alt="logo" />
          </span>
        );
      },
    },
    {
      items: user?.role === "admin" ? itemsAdmin : itemsSeller,
    },
    {
      template: () => {
        return (
          <div className="menu-footer">
            <Button icon="pi pi-power-off" rounded text severity="danger" size="large" aria-label="Logout" 
             style={{marginRight: '2px', position: 'relative', top: '5px'}}
              onClick={logout}
            />
            <div className="menu-user">
            <span className="menu-name-user">{user?.username}</span>
            <span className="menu-role-user">{user?.role === "admin" ? "Administrador" : "Aliado"}</span>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="menu-left">
     <Menu model={items} className="p-menu" />
    </div>
  );
}
