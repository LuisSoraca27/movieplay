import { useState } from 'react';
import '../style/inventory.css';
import CourseProduct from '../Components/Inventory/CourseProduct';
import LicenseProduct from '../Components/Inventory/LicenseProduct';
import ProfileProduct from '../Components/Inventory/ProfileProduct';
import AccountProduct from '../Components/Inventory/AccountProduct';
import ComboProduct from '../Components/Inventory/ComboProduct';


const Inventory = () => {

    const [view, setView] = useState('perfiles');

    const changeView = () => {
        switch (view) {
            case 'perfiles':
                return <ProfileProduct />
            case 'cuentas':
                return <AccountProduct />
            case 'combos':
                return <ComboProduct />
            case 'cursos':
                return <CourseProduct />
            case 'licencias':
                return <LicenseProduct />
            default:
                break;
        }
    }
    return (
        <div className='container-products' >
            <nav className='navbar-products'>
                <ul className='nav-products'>
                    <div className='title-page'>
                        <div className="style-icon">
                            <i className="pi pi pi-box"
                                style={{ fontSize: '35px', color: '#212529' }}
                            ></i>
                        </div>
                        <span color='#212529'>
                            Inventario
                        </span>
                    </div>
                    <li className={`nav-item-products ${(view === 'perfiles' ? 'color-select' : '')}`}
                        onClick={() => setView('perfiles')}
                    >
                        Perfiles
                    </li>
                    <li className={`nav-item-products ${(view === 'cuentas' ? 'color-select' : '')}`}
                        onClick={() => setView('cuentas')}
                    >
                        Cuentas
                    </li>
                    <li className={`nav-item-products ${(view === 'combos' ? 'color-select' : '')}`}
                        onClick={() => setView('combos')}
                    >
                        Combos
                    </li>
                
                    <li className={`nav-item-products ${(view === 'cursos' ? 'color-select' : '')}`}
                        onClick={() => setView('cursos')}
                    >
                        Cursos
                    </li>
                    <li className={`nav-item-products ${(view === 'licencias' ? 'color-select' : '')}`}
                        onClick={() => setView('licencias')}
                    >
                        Mas Servicios
                    </li>
                </ul>
            </nav>
            {changeView()}
        </div >
    );
};

export default Inventory;