// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import '../style/offcanvasmobile.css';
import { useNavigate } from 'react-router-dom';

const SidebarRight = ({ show, handleClose }) => {
    const navigate = useNavigate();

    const navigateTo = (path) => {
        handleClose();
        navigate(path);
    };

    return (
        <Sidebar visible={show} onHide={handleClose} position="right">
            <div className="p-sidebar-body">
                <div className="opcion-mobile" onClick={() => navigateTo('/profiles')}>
                    <h3>Perfiles</h3>
                </div>
                <div className="opcion-mobile" onClick={() => navigateTo('/accounts')}>
                    <h3>Cuentas</h3>
                </div>
                <div className="opcion-mobile" onClick={() => navigateTo('/combos')}>
                    <h3>Combos</h3>
                </div>
                <div className="opcion-mobile" onClick={() => navigateTo('/courses')}>
                    <h3>Cursos</h3>
                </div>
                <div className="opcion-mobile" onClick={() => navigateTo('/licenses')}>
                    <h3>Mas Servicios</h3>
                </div>
            </div>
        </Sidebar>
    );
};

export default SidebarRight;
