import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { editProfileThunk } from '../../features/user/profileSlice';

// eslint-disable-next-line react/prop-types
const EditProfile = ({ data, show, onClose, reCharge }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        emailAccount: '',
        passwordAccount: '',
        profileAccount: '',
        pincodeAccount: ''
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
                passwordAccount: data.passwordAccount || '',
                profileAccount: data.profileAccount || '',
                pincodeAccount: data.pincodeAccount || ''
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
        console.log(form);
        dispatch(editProfileThunk(data.id, form))
            .then(() => {
                setForm({
                    name: '',
                    description: '',
                    price: '',
                    emailAccount: '',
                    passwordAccount: '',
                    profileAccount: '',
                    pincodeAccount: ''
                });
                onClose();
                reCharge();
            })
    };

    const handleErrors = () => {
        if (success) {
            Swal.fire({
                title: 'Perfil editado',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
            onClose();
            reCharge();
        }
        if (error) {
            Swal.fire({
                title: 'Error al editar el perfil',
                text: error,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    return (
        <div>
            <Dialog visible={show} onHide={onClose} modal style={{ width: '400px' }} header="Editar Perfil"
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
                    <div style={{ width: '100%' }}>
                        <label htmlFor="name" className='style-label'>Nombre</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="name"
                            placeholder="Escribe el nombre del perfil"
                            value={form.name}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <br />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="description" className='style-label'>Descripción</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="description"
                            placeholder="Escribe la descripción del perfil"
                            value={form.description}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <br />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="price" className='style-label'>Precio</label>
                        <InputText
                            type="number"
                            className={`form-control form-control-lg`}
                            name="price"
                            placeholder="Escribe el precio del perfil"
                            value={form.price}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <br />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="emailAccount" className='style-label'>Correo de cuenta</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="emailAccount"
                            placeholder="Escribe el correo de la cuenta"
                            value={form.emailAccount}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <br />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="passwordAccount" className='style-label'>Contraseña de cuenta</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="passwordAccount"
                            placeholder="Escribe la contraseña de la cuenta"
                            value={form.passwordAccount}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <br />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="profileAccount" className='style-label'>Perfil de cuenta</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="profileAccount"
                            placeholder="Escribe el perfil de la cuenta"
                            value={form.profileAccount}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <br />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="pincodeAccount" className='style-label'>Pin de perfil</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="pincodeAccount"
                            placeholder="Escribe el pin de perfil"
                            value={form.pincodeAccount}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default EditProfile;
