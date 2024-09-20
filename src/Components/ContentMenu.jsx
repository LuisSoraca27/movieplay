import '../style/ContentMenu.css';
import logo from '../assets/logo.png';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';


const ContentMenu = () => {

    const navigate = useNavigate();
    const HandleNavigate = (path) => {
        navigate(path);
    }

    const { logout } = useAuthContext()

    const user = JSON.parse(localStorage.getItem('user'))

    const contentMenu = () => {

        if (user?.role === 'admin') {
            return (
                <>
                <li onClick={() => HandleNavigate('/')}>
                    <i className="pi pi-fw pi-home" style={{  fontSize: '25px' }}></i>
                       <span>Inicio</span>
                    </li>
                    <li onClick={() => HandleNavigate('/users')}>
                    <i className="pi pi-fw pi-users" style={{ fontSize: '25px' }}></i>
                       <span>Usuarios</span>
                     </li>
                    <li onClick={() => HandleNavigate('/products')}>
                    <i className="pi pi-fw pi-shopping-bag" style={{ fontSize: '25px' }}></i>
                        <span>Productos</span>
                    </li>
                    <li onClick={() => HandleNavigate('/notifications')}>
                    <i className="pi pi-fw pi-bell" style={{ fontSize: '25px' }}></i>
                        <span>Notificaciones</span>
                     </li>
                    <li onClick={() => HandleNavigate('/orders')}>
                    <i className="pi pi-fw pi-shopping-cart" style={{  fontSize: '25px' }}></i>
                       <span>Ventas</span>
                    </li>
                    <li onClick={() => HandleNavigate('/support')}>
                    <i className="pi pi-fw pi-info-circle" style={{ fontSize: '25px' }}></i>
                        <span>Soporte</span>
                    </li>
                </>
            )
        } else if (user?.role === 'seller') {
            return (
                <>
                <li onClick={() => HandleNavigate('/')}>
                    <i className="pi pi-fw pi-home" style={{  fontSize: '25px' }}></i>
                       <span>Inicio</span>
                    </li>
                    <li onClick={() => HandleNavigate('/myprofile')}>
                       <i className="pi pi-fw pi-user" style={{  fontSize: '25px' }}></i>
                       <span>Mi cuenta</span>
                    </li>
                 <li onClick={() => HandleNavigate('/orders-client')}>
                    <i className="pi pi-fw pi-shopping-cart" style={{  fontSize: '25px' }}></i>
                       <span>Mis compras</span>
                </li>
                <li onClick={() => HandleNavigate('/support')}>
                    <i className="pi pi-fw pi-info-circle" style={{ fontSize: '25px' }}></i>
                        <span>Soporte</span>
                </li>
                </>
            )
        }
    }

    return (
        <div className='content-menu'>
            <div className="content-header">
                <img src={logo} alt="Logo" width='150px' />
            </div>
            <div className='content-nav'>
                {/* <Menu
                    model={items}
                    className='menu p-mb-4'
                /> */}
                <ul>
                  {contentMenu()}
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
    );
};

export default ContentMenu;