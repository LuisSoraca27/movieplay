import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { editUserThunk } from '../features/user/userSlice';
import { Toast } from 'primereact/toast';
import useErrorHandler from '../Helpers/useErrorHandler';

const ModalEditUser = ({ open, onClose, recharge, data }) => {


    const { error, success } = useSelector((state) => state.error);

    const handleError = useErrorHandler(error, success);
    const [loading, setLoading] = useState(false);

    const toast = useRef(null);

    const dispatch = useDispatch();
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        setValue('username', data?.username || '');
        setValue('email', data?.email || '');
        setValue('phone', data?.phone || '');
    }, [data, setValue]);

    const onSubmit = (formData) => {
        setLoading(true);
        const editData = {
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
        };
        dispatch(editUserThunk(editData, data.id))
            .then(() => {
                setValue('username', '');
                setValue('email', '');
                setValue('phone', '');
            })
            .finally(() => {
                onClose();
                setLoading(false);
            });
    };


    useEffect(() => {
        handleError(toast.current);
    }, [error, success]);

    return (
        <>
          <Toast ref={toast}/>
        <Dialog
            visible={open}
            onHide={onClose}
            className="p-fluid"
            header="Editar usuario"
            footer={
                <div>
                    <Button label="Confirmar" icon="pi pi-check" severity='success' onClick={handleSubmit(onSubmit)}
                     loading={loading} disabled={loading}
                    />
                </div>
            }
        >
            <div style={{ padding: '0px' }}>
                <form>
                    <div className="row">
                        <div className="mb-2">
                            <label htmlFor="username">
                                <span style={{ fontSize: '17px', fontWeight: '400' }}>Nombre de Usuario</span>
                            </label>
                            <InputText
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Ingrese el nombre de usuario"
                                {...register('username', { required: true })}
                            />
                        </div>
                         <br />
                        <div className="mb-2">
                            <label htmlFor="email">
                                <span style={{ fontSize: '17px', fontWeight: '400' }}>Correo</span>
                            </label>
                            <InputText
                                id="email"
                                type="text"
                                name="email"
                                placeholder="Ingrese el correo"
                                {...register('email', { required: true })}
                            />
                        </div>
                        <br />
                        <div className="mb-2">
                            <label htmlFor="phone">
                                <span style={{ fontSize: '17px', fontWeight: '400' }}>Telefono</span>
                            </label>
                            <InputText
                                id="phone"
                                type="phone"
                                name="phone"
                                placeholder="Ingrese un numero de telefono"
                                {...register('phone', { required: true })}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Dialog>
        </>
    );
};

export default ModalEditUser;
