import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../style/menuLeft.css";

// eslint-disable-next-line react/prop-types
const SidebarLeft = ({ visible, onHide }) => {
  const itemsAdmin = [
    {
      label: "Inicio",
      icon: "pi pi-fw pi-home",
      link: "/",
    },
    {
      label: "Usuarios",
      icon: "pi pi-fw pi-users",
      link: "/usuarios",
    },
    {
      label: "Clientes",
      icon: "pi pi-users",
      link: "/clientes",
    },
    {
      label: "Inventario",
      icon: "pi pi-box",
      link: "/inventario",
    },
    {
      label: "Ventas internas",
      icon: "pi pi-shopping-cart",
      link: "/pedidos-internos",
    },
    {
      label: "Ventas externas",
      icon: "pi pi-shopping-cart",
      link: "/pedidos",
    },
    {
      label: "Gastos",
      icon: "pi pi-money-bill",
      link: "/gastos",
    },
    {
      label: "Soporte",
      icon: "pi pi-info-circle",
      link: "/soporte",
    },
  ];

  const itemsSeller = [
    {
      label: "Inicio",
      icon: "pi pi-home",
      link: "/",
    },
    {
      label: "Mi cuenta",
      icon: "pi pi-user",
      link: "/mi-perfil",
    },
    {
      label: "Mis pedidos",
      icon: "pi pi-shopping-cart",
      link: "/pedidos-usuarios",
    },
    {
      label: "Soporte",
      icon: "pi pi-info-circle",
      link: "/soporte",
    },
  ];

  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleNavigate = (path) => {
    onHide();
    navigate(path);
  };

  const renderMenuItems = () => {
    if (user?.role === "admin") {
      return (
        <>
          {itemsAdmin.map((item, index) => (
            <li
              key={index}
              onClick={() => handleNavigate(item.link)}
              className="p-menuitem-link"
              style={{ margin: "15px 0" }}
            >
              <i
                className={`${item.icon} p-menuitem-icon`}
                style={{ fontSize: "25px" }}
              ></i>
              <span className="menu-link">{item.label}</span>
            </li>
          ))}
        </>
      );
    } else if (user?.role === "seller") {
      return (
        <>
          {itemsSeller.map((item, index) => (
            <li
              key={index}
              onClick={() => handleNavigate(item.link)}
              className="p-menuitem-link"
              style={{ margin: "15px 0" }}
            >
              <i
                className={`${item.icon} p-menuitem-icon`}
                style={{ fontSize: "25px" }}
              ></i>
              <span className="menu-link">{item.label}</span>
            </li>
          ))}
        </>
      );
    }
  };

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position="left"
      style={{ backgroundColor: "#0f172a" }}
    >
      <div className="content-menu-sidebar">
        <div className="content-header-sidebar">
          <img src={logo} alt="Logo" width="120px" />
        </div>
        <div className="content-nav">
          <ul>{renderMenuItems()}</ul>
        </div>
        <div className="menu-footer">
          <Button
            icon="pi pi-power-off"
            rounded
            text
            severity="danger"
            size="large"
            aria-label="Logout"
            style={{ marginRight: "2px", position: "relative", top: "5px" }}
            onClick={logout}
          />
          <div className="menu-user">
            <span className="menu-name-user">{user?.username}</span>
            <span className="menu-role-user">
              {user?.role === "admin" ? "Administrador" : "Aliado"}
            </span>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarLeft;
