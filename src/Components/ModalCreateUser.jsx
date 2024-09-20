import React, { useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { createUserThunk } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import useErrorHandler from '../Helpers/useErrorHandler';
import { Toast } from 'primereact/toast';

// eslint-disable-next-line react/prop-types
const ModalCreateUser = ({ open, onClose }) => {
    const initialData = {
        username: '',
        email: '',
        password: '',
        phone: '',
        role: ''
    };
    const toast = useRef(null);
    const [dataUser, setDataUser] = React.useState(initialData);
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const { error, success } = useSelector(state => state.error);
    const handleError = useErrorHandler(error, success);

    const handleChange = (e) => {
        setDataUser({
            ...dataUser,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        dispatch(createUserThunk(dataUser))
            .then(() => {
                setLoading(false);
                onClose();
                setDataUser(initialData);
            })
    };

  
    useEffect(() => {
        handleError(toast.current);
    }, [error, success]);

    return (
        <>
        <Toast ref={toast} />
         <Dialog
            visible={open}
            onHide={onClose}
            className="p-fluid"
            header="Crear usuario"
            footer={
                <div>
                    <Button label="Crear usuario" icon="pi pi-check" className="p-button-success" onClick={handleSubmit}
                    loading={loading} disabled={loading}
                    />
                </div>
            }
        >
            <div style={{ padding: '20px' }}>
            <div className="flex flex-column gap-2">
           <label htmlFor="username">Nombre de usuario</label>
           <InputText id="username" aria-describedby="username-help"
           name="username"
           onChange={handleChange}
           value={dataUser.username}
           />
            </div>
            <br />
                <div className="p-field">
                    <label htmlFor="email">Correo electrónico</label>
                    <InputText
                        id="email"
                        name="email"
                        onChange={handleChange}
                        value={dataUser.email}
                        required
                    />
                </div>
                <br />
                <div className="p-field">
                    <label htmlFor="password">Contraseña</label>
                    <InputText
                        id="password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                        value={dataUser.password}
                        required
                    />
                </div>
                <br />
                <div className="p-field">
                    <label htmlFor="phone">Numero de Whatsapp</label>
                    <InputText
                        id="phone"
                        name="phone"
                        type="phone"
                        onChange={handleChange}
                        value={dataUser.phone}
                        required
                    />
                </div>
                <br />
                <div className="p-field">
                    <label htmlFor="role">Selecciona el Rol del usuario</label>
                    <Dropdown
                        id="role"
                        name="role"
                        options={[
                            { label: 'Vendedor', value: 'seller' },
                            { label: 'Administrador', value: 'admin' },
                        ]}
                        onChange={handleChange}
                        value={dataUser.role}
                        placeholder="Selecciona el rol"
                    />
                </div>
            </div>
        </Dialog>
        </>
    );
};

export default ModalCreateUser;
