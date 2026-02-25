import '../style/ContentMenu.css';
import logo from '../assets/logo.png';
import { Button } from "@heroui/react";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { Home, Users, Bell, ShoppingCart, Info, User } from 'lucide-react';

const ContentMenu = () => {
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };

    const { logout } = useAuthContext();
    const user = JSON.parse(localStorage.getItem('user'));
    const publicSettings = useSelector((state) => state.storeSettings.publicSettings);
    const storeLogo = publicSettings?.logo || logo;

    const adminMenu = [
        { label: 'Inicio', icon: Home, path: '/' },
        { label: 'Usuarios', icon: Users, path: '/usuarios' },
        { label: 'Notificaciones', icon: Bell, path: '/notificaciones' },
        { label: 'Ventas', icon: ShoppingCart, path: '/pedidos' },
        { label: 'Soporte', icon: Info, path: '/soporte' },
    ];

    const sellerMenu = [
        { label: 'Inicio', icon: Home, path: '/' },
        { label: 'Mi cuenta', icon: User, path: '/mi-perfil' },
        { label: 'Mis compras', icon: ShoppingCart, path: '/pedidos-usuarios' },
        { label: 'Soporte', icon: Info, path: '/soporte' },
    ];

    const menuItems = user?.role === 'admin' ? adminMenu : sellerMenu;

    return (
        <div className='content-menu'>
            <div className="content-header">
                <img src={storeLogo} alt="Logo" width='150px' />
            </div>
            <div className='content-nav'>
                <ul>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <li key={index} onClick={() => handleNavigate(item.path)}>
                                <Icon size={25} className="text-primary" />
                                <span>{item.label}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className='content-footer'>
                <span className='menu_user'>
                    <User size={25} className="text-primary" />
                    {user?.username}
                    <p>{user?.role === 'admin' ? 'Administrador' : 'Aliado'}</p>
                </span>
                <Button
                    color="danger"
                    size="sm"
                    radius="full"
                    onPress={logout}
                >
                    Cerrar Sesión
                </Button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '17px' }}>
                <strong style={{ color: 'white', fontSize: '14px' }}>Dk Soluciones V1.5</strong>
            </div>
        </div>
    );
};

export default ContentMenu;