import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { useDispatch, useSelector } from 'react-redux';
import { createCourseThunk } from '../../features/course/courseSlice';
import { removeError, removeSuccess } from '../../features/error/errorSlice';
import Swal from 'sweetalert2';

const CreateCourse = ({ show, onClose, reCharge }) => {
    const dispatch = useDispatch();
    const { error, success } = useSelector((state) => state.error);

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        linkCourse: '',
        courseImg: ''
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
                text: 'El Curso se ha creado con éxito',
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
        formData.append('linkCourse', form.linkCourse);
        formData.append('courseImg', form.courseImg);
        dispatch(createCourseThunk(formData))
            .then(() => {
                setForm({
                    name: '',
                    description: '',
                    price: '',
                    linkCourse: '',
                    courseImg: ''
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
                header="Crear Curso"
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
                                    style={{width: '100%'}}
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
                                    style={{width: '100%'}}
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
                                    style={{width: '100%'}}
                                />
                            </div>
                            <div style={{ width: '100%', marginBottom: '20px' }}>
                                <label className='style-label'>Link del curso</label>
                                <InputText
                                    size='lg'
                                    type="text"
                                    name="linkCourse"
                                    value={form.linkCourse}
                                    onChange={handleChange}
                                    style={{width: '100%'}}
                                />
                            </div>
                            <div style={{ width: '100%', marginBottom: '20px' }}>
                                <label className='style-label'>Imagen del curso</label>
                                <FileUpload
                                    mode="basic"
                                    name="courseImg"
                                    chooseLabel="Elegir"
                                    className="p-button-info"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    onSelect={(e) => setForm({ ...form, courseImg: e.files[0] })}
                                    onClear={() => setForm({ ...form, courseImg: '' })}
                                    invalidFileSizeMessage="El archivo es demasiado grande"
                                    invalidFileTypeMessage="No se admite este tipo de archivo"
                                    style={{width: '100%', marginTop: '5px'}}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default CreateCourse;
