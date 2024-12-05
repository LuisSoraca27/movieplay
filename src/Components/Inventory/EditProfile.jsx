import  { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { editProfileThunk } from '../../features/user/profileSlice';
import useErrorHandler from '../../Helpers/useErrorHandler';
import { Toast } from 'primereact/toast';



const EditProfile = ({ data, show, onClose, reCharge }) => {

    const dispatch = useDispatch();
    const toast = useRef(null);
    const { error, success } = useSelector((state) => state.error);
    const handleErrors = useErrorHandler(error, success);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        durationOfService: '',
        emailAccount: '',
        passwordAccount: '',
        profileAccount: '',
        pincodeAccount: ''
    });
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || '',
                description: data.description || '',
                price: data.price || '',
                durationOfService: data.durationOfService || '',
                emailAccount: data.emailAccount || '',
                passwordAccount: data.passwordAccount || '',
                profileAccount: data.profileAccount || '',
                pincodeAccount: data.pincodeAccount || ''
            });
        }
    }, [data]);

    useEffect(() => {
        handleErrors(toast.current);
    }, [error, success]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        dispatch(editProfileThunk(data.id, form))
            .then(() => {
                reCharge();
                onClose();
                setLoading(false);
            })
    };


    return (
        <div>
            <Toast ref={toast} />
            <Dialog visible={show} onHide={onClose} modal style={{ width: '400px' }} header="Editar Perfil"
             footer={
                 <div>
                     <Button
                        type="submit"
                        icon="pi pi-check"
                        severity='success'
                        label="Editar"
                        onClick={handleSubmit}
                        disabled={loading}
                         loading={loading}
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
                            value={form.name}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <hr />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="description" className='style-label'>Descripción</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <hr />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="price" className='style-label'>Precio</label>
                        <InputText
                            type="number"
                            className={`form-control form-control-lg`}
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <hr />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="price" className='style-label'>Duración de servicio</label>
                        <InputText
                            type="number"
                            className={`form-control form-control-lg`}
                            name="durationOfService"
                            value={form.durationOfService}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <hr />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="emailAccount" className='style-label'>Correo de cuenta</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="emailAccount"
                            value={form.emailAccount}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <hr />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="passwordAccount" className='style-label'>Contraseña de cuenta</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="passwordAccount"
                            value={form.passwordAccount}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <hr />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="profileAccount" className='style-label'>Perfil de cuenta</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="profileAccount"
                            value={form.profileAccount}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <hr />
                    <div style={{ width: '100%' }}>
                        <label htmlFor="pincodeAccount" className='style-label'>Pin de perfil</label>
                        <InputText
                            type="text"
                            className={`form-control form-control-lg`}
                            name="pincodeAccount"
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
