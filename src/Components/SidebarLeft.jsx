import '../style/ContentMenu.css';
import '../style/Sidebar.css';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';

// eslint-disable-next-line react/prop-types
const SidebarLeft = ({ visible, onHide }) => {
    const navigate = useNavigate();
    const { logout } = useAuthContext();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleNavigate = (path) => {
        onHide();
        navigate(path);
    };

    const renderMenuItems = () => {
        if (user?.role === 'admin') {
            return (
                <>
                    <li onClick={() => handleNavigate('/')}>
                        <i className="pi pi-fw pi-home" style={{ fontSize: '25px' }}></i>
                        <span>Inicio</span>
                    </li>
                    <li onClick={() => handleNavigate('/users')}>
                        <i className="pi pi-fw pi-users" style={{ fontSize: '25px' }}></i>
                        <span>Usuarios</span>
                    </li>
                    <li onClick={() => handleNavigate('/products')}>
                        <i className="pi pi-fw pi-shopping-bag" style={{ fontSize: '25px' }}></i>
                        <span>Productos</span>
                    </li>
                    <li onClick={() => handleNavigate('/notifications')}>
                        <i className="pi pi-fw pi-bell" style={{ fontSize: '25px' }}></i>
                        <span>Notificaciones</span>
                    </li>
                    <li onClick={() => handleNavigate('/orders')}>
                        <i className="pi pi-fw pi-shopping-cart" style={{ fontSize: '25px' }}></i>
                        <span>Ventas</span>
                    </li>
                    <li onClick={() => handleNavigate('/support')}>
                        <i className="pi pi-fw pi-info-circle" style={{ fontSize: '25px' }}></i>
                        <span>Soporte</span>
                    </li>
                </>
            );
        } else if (user?.role === 'seller') {
            return (
                <>
                    <li onClick={() => handleNavigate('/')}>
                        <i className="pi pi-fw pi-home" style={{ fontSize: '25px' }}></i>
                        <span>Inicio</span>
                    </li>
                    <li onClick={() => handleNavigate('/myprofile')}>
                       <i className="pi pi-fw pi-user" style={{  fontSize: '25px' }}></i>
                       <span>Mi cuenta</span>
                    </li>
                    <li onClick={() => handleNavigate('/orders-client')}>
                        <i className="pi pi-fw pi-shopping-cart" style={{ fontSize: '25px' }}></i>
                        <span>Mis compras</span>
                    </li>
                    <li onClick={() => handleNavigate('/support')}>
                        <i className="pi pi-fw pi-info-circle" style={{ fontSize: '25px' }}></i>
                        <span>Soporte</span>
                    </li>
                </>
            );
        }
    };

    return (
        <Sidebar visible={visible} onHide={onHide} position="left">
            <div className='content-menu' style={{width:'100%'}}>
            <div className="content-header">
                <img src={logo} alt="Logo" width='150px' />
            </div>
            <div className='content-nav'>
                {/* <Menu
                    model={items}
                    className='menu p-mb-4'
                /> */}
                <ul>
                  {renderMenuItems()}
                </ul>
            </div>
            <div className='content-footer'>
            <span className='menu_user'>
            <i className="pi pi-fw pi-user" style={{ color: 'var(--primary-color)', fontSize: '25px' }}></i>
            {
                user?.username
            }
            <p>{user?.role === 'admin' ? 'Administrador' : 'Aliado'}</p>
            </span>
            <Button label="Cerrar Sesión" size='small' severity="danger" rounded onClick={logout} />
            </div>
            <div style={{ textAlign: 'center', marginTop: '17px' }}>
                <strong style={{ color: 'white', fontSize: '14px' }}>Dk Soluciones V1.5</strong>
            </div>
        </div>
        </Sidebar>
    );
};

export default SidebarLeft;
