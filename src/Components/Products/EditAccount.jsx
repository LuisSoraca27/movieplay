import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { editAccountThunk } from '../../features/account/accountSlice';

const EditAccount = ({ data, show, onClose, reCharge }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        emailAccount: '',
        passwordAccount: ''
    });

    const dispatch = useDispatch();
    const { success, error } = useSelector((state) => state.error);

    useEffect(() => {
        handleErrors();
        if (data) {
            setForm({
                name: data.name || '',
                description: data.description || '',
                price: data.price || '',
                emailAccount: data.emailAccount || '',
                passwordAccount: data.passwordAccount || ''
            });
        }
    }, [data, success, error]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(editAccountThunk(data.id, form));
    };

    const handleErrors = () => {
        if (success) {
            Swal.fire({
                title: 'Cuenta editada',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
            onClose();
            reCharge();
        }
        if (error) {
            Swal.fire({
                title: 'Error al editar la cuenta',
                text: error,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    return (
        <div>
            <Dialog visible={show} onHide={onClose} modal style={{ width: '400px' }} header="Editar Cuenta"
            footer={
                <div>
                      <Button
                        type="submit"
                        icon="pi pi-check"
                        severity='success'
                        label="Editar"
                        onClick={handleSubmit}
                    />
                </div>
            }
            >
                <form onSubmit={handleSubmit}>
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <label htmlFor="name" className='style-label'>Nombre</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="name"
                            placeholder="Escribe el nombre del perfil"
                            value={form.name}
                            onChange={handleChange}
                            required
                            style={{width: '100%'}}
                        />
                    </div>
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <label htmlFor="description" className='style-label'>Descripción</label>
                        <InputTextarea
                            rows={3}
                            type="text"
                            className={`form-control form-control-lg`}
                            name="description"
                            placeholder="Escribe la descripción del perfil"
                            value={form.description}
                            onChange={handleChange}
                            required
                            style={{width: '100%'}}
                        />
                    </div>
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <label htmlFor="price" className='style-label'>Precio</label>
                        <InputText
                            type="number"
                            className={`form-control form-control-lg`}
                            name="price"
                            placeholder="Escribe el precio del perfil"
                            value={form.price}
                            onChange={handleChange}
                            required
                            style={{width: '100%'}}
                        />
                    </div>
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <label htmlFor="emailAccount" className='style-label' >Correo de cuenta</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="emailAccount"
                            placeholder="Escribe el correo de la cuenta"
                            value={form.emailAccount}
                            onChange={handleChange}
                            required
                            style={{width: '100%'}}
                        />
                    </div>
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <label htmlFor="passwordAccount" className='style-label'>Contraseña de cuenta</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="passwordAccount"
                            placeholder="Escribe la contraseña de la cuenta"
                            value={form.passwordAccount}
                            onChange={handleChange}
                            required
                            style={{width: '100%'}}
                        />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default EditAccount;
