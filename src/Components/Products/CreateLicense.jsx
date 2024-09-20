import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { useDispatch, useSelector } from 'react-redux';
import { createLicenseThunk } from '../../features/license/licenseSlice';
import { removeError, removeSuccess } from '../../features/error/errorSlice';
import Swal from 'sweetalert2';

// eslint-disable-next-line react/prop-types
const CreateLicense = ({ show, onClose, reCharge }) => {
    const dispatch = useDispatch();
    const { error, success } = useSelector((state) => state.error);

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        licenseImg: ''
    });

    const [procesing, setProcesing] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleErrors = () => {
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lo sentimos',
                text: 'Ha ocurrido un error, por favor intenta de nuevo',
            });
            dispatch(removeError());
        } else if (success) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'La Licencia/APK se ha creado con éxito',
                confirmButtonText: 'Aceptar',
            });
            dispatch(removeSuccess());
        }
    };

    const handleSubmit = (e) => {
        setProcesing(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('price', form.price);
        formData.append('licenseImg', form.licenseImg);
        dispatch(createLicenseThunk(formData))
            .then(() => {
                setForm({
                    name: '',
                    description: '',
                    price: '',
                    licenseImg: ''
                });
                onClose();
                reCharge();
                setProcesing(false);
            });
    };

    React.useEffect(() => {
        handleErrors();
    }, [error, success]);

    return (
        <div>
            <Dialog visible={show} onHide={onClose} modal style={{ width: '380px' }}
                header="Crear Licencia/APK"
                footer={
                    <div>
                        <Button
                            label="Confirmar"
                            icon="pi pi-check"
                            severity='success'
                            onClick={handleSubmit}
                            autoFocus
                            loading={procesing}
                        />
                    </div>
                }
            >
                <div>
                    <form onSubmit={handleSubmit} style={{ textAlign: 'start', width: '100%' }} encType='multipart/form-data'>
                        <div style={{ width: '100%', marginBottom: '20px' }}>
                            <label className='style-label'>Nombre</label>
                            <InputText
                                size='lg'
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ width: '100%', marginBottom: '20px' }}>
                            <label className='style-label'>Descripción</label>
                            <InputText
                                size='lg'
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ width: '100%', marginBottom: '20px' }}>
                            <label className='style-label'>Precio</label>
                            <InputText
                                size='lg'
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ width: '100%', marginBottom: '20px' }}>
                            <label className='style-label'>Imagen de la Licencia/APKs</label>
                            <FileUpload
                                mode="basic"
                                name="licenseImg"
                                chooseLabel="Elegir"
                                className="p-button-info"
                                accept="image/*"
                                maxFileSize={1000000}
                                onSelect={(e) => setForm({ ...form, licenseImg: e.files[0] })}
                                onClear={() => setForm({ ...form, licenseImg: '' })}
                                invalidFileSizeMessage="El archivo es demasiado grande"
                                invalidFileTypeMessage="No se admite este tipo de archivo"
                                style={{ width: '100%', marginTop: '5px' }}
                            />
                        </div>
                    </form>
                </div>
            </Dialog>
        </div>
    );
};

export default CreateLicense;
