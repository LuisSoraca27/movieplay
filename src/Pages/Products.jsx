import React, { useState } from 'react';
import '../style/products.css';
import ViewProduct from '../Components/ViewProduct';
import { Link } from 'react-router-dom';
import CourseProduct from '../Components/Products/CourseProduct';
import LicenseProduct from '../Components/Products/LicenseProduct';
import ProfileProduct from '../Components/Products/ProfileProduct';
import AccountProduct from '../Components/Products/AccountProduct';
import ComboProduct from '../Components/Products/ComboProduct';


const Products = () => {

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
                            <i className="pi pi-fw pi-shopping-bag"
                                style={{ fontSize: '35px', color: '#6366f1' }}
                            ></i>
                        </div>
                        <span >
                            PRODUCTOS
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
                        Licencias y APKs
                    </li>
                </ul>
            </nav>
            {changeView()}
        </div >
    );
};

export default Products;