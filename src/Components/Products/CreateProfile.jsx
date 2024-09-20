import { useEffect ,useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createProfileThunk } from '../../features/user/profileSlice';
import { removeError, removeSuccess } from '../../features/error/errorSlice';
import '../../style/products.css';

const CreateProfile = ({ show, onClose, reCharge }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [selectedOption, setSelectedOption] = useState('');
    const dispatch = useDispatch();
    const { error, success } = useSelector(state => state.error);



    const footerContent = (
        <div>
            <Button type="button" label="Confirmar" icon="pi pi-check" onClick={() => onSubmit()} autoFocus severity='success' />
        </div>
    );

    const onSubmit = handleSubmit(data => {
        console.log(selectedOption);
        const dataProfile = {
            ...data,
            categoryId: selectedOption
        }
        console.log(dataProfile);
        dispatch(createProfileThunk(dataProfile))
            .then(() => {
                onClose();
                reset();
                reCharge();
            });
            console.log('Se ha creado el perfil');
    }
) 
    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleErrors = () => {
        if (!!error) {
            Swal.fire({
                icon: 'error',
                title: 'Lo sentimos',
                text: 'Ha ocurrido un error, por favor intenta de nuevo',
            });
            dispatch(removeError());
        } else if (!!success) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El perfil se ha creado con éxito',
                confirmButtonText: 'Aceptar',
            });
            dispatch(removeSuccess());
        }
    };


    useEffect(() => {
        handleErrors();
    }, [error, success]);

    return (
        <div>
            <Dialog visible={show} onHide={onClose} modal style={{ width: '50vw' }} header={`Crear ${selectedOption === '11' ? 'IPTV' : 'Perfil'}`}
                footer={footerContent}
           >
                
                <form   style={{ textAlign: 'start', width: '100%' }}>
                    <div className="container-form-combos">
                        <div className="colum-form-1">
                            <div style={{ width: '100%' }}>
                                <label htmlFor="categoryId" className='style-label'>
                                    Plataforma
                                </label>
                                <Dropdown
                                    optionLabel="name"
                                    value={selectedOption}
                                    name="categoryId"
                                    id="categoryId"
                                    {...register('categoryId', { required: true })}
                                    options={[
                                        { name: 'Netflix', value: '2' },
                                        { name: 'Max', value: '3' },
                                        { name: 'Disney+ Premium', value: '4' },
                                        { name: 'Disney+ Estándar', value: '30' },
                                        { name: 'Disney+ Basico', value: '29' },
                                        { name: 'Amazon Prime Video', value: '1' },
                                        { name: 'Paramount+', value: '6' },
                                        { name: 'Vix+', value: '7' },
                                        { name: 'Plex', value: '8' },
                                        { name: 'Crunchyroll', value: '9' },
                                        { name: 'El ProfeNet', value: '10' },
                                        { name: 'Iptv', value: '11' },
                                        { name: 'Apple TV', value: '19' },
                                        { name: 'Pornhub', value: '20' },
                                        { name: 'Rakuten Viki', value: '22' },
                                        { name: 'Acorn TV', value: '23' },
                                        { name: 'Mubi', value: '24' },
                                        { name: 'WASender', value: '25' },
                                        { name: 'Regalo', value: '26' },
                                        { name: 'TvMia', value: '28' },
                                        { name: 'Microsoft 365', value: '31' },
                                    ]}
                                    onChange={handleSelectChange}
                                    placeholder="Selecciona una plataforma"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <br />
                            <div style={{ width: '100%' }}>
                                <label htmlFor="name" >
                                    Nombre
                                </label>
                                <InputText
                                    type="text"
                                    className={`${errors.name ? 'p-invalid' : ''}`}
                                    name="name"
                                    {...register('name', { required: true })}
                                    style={{ width: '100%' }}

                                />
                                {errors.name && <small id="username-help">Campo requerido</small>}
                            </div>

                            <br />

                            <div style={{ width: '100%' }}>
                                <label htmlFor="description" className='style-label'>
                                    Descripción
                                </label>
                                <InputText
                                    type="text"
                                    className={`${errors.description ? 'p-invalid' : ''}`}
                                    name="description"
                                    {...register('description', { required: true, maxLength: 230 })}
                                    style={{ width: '100%' }}

                                />
                                {errors.description && errors.description.type === 'required' && (
                                    <small className="invalid-feedback">Campo requerido</small>
                                )}
                                {errors.description && errors.description.type === 'maxLength' && (
                                    <small className="invalid-feedback">La descripción debe tener como máximo 230 caracteres</small>
                                )}
                            </div>

                            <br />

                            <div style={{ width: '100%' }}>
                                <label htmlFor="price" className='style-label'>
                                    Precio
                                </label>
                                <InputText
                                    type="number"
                                    className={`form-control  form-control-lg ${errors.price ? 'p-invalid' : ''}`}
                                    name="price"
                                    {...register('price', { required: true })}
                                    style={{ width: '100%' }}
                                />
                                {errors.price && <small className="invalid-feedback">Campo requerido</small>}
                            </div>
                            <br />
                            <div style={{ width: '100%' }}>
                                <label htmlFor="durationOfService" className='style-label'>
                                    Duración del servicio
                                </label>
                                <InputText
                                    type="number"
                                    className={` ${errors.durationOfService ? 'p-invalid' : ''}`}
                                    name="durationOfService"
                                    {...register('durationOfService', { required: true })}
                                    style={{ width: '100%' }}
                                />
                                {errors.durationOfService && <small className="invalid-feedback">Campo requerido</small>}
                            </div>
                        </div>

                        <div className="colum-form-2">
                           
                            <div style={{ width: '100%' }}>
                                <label htmlFor="emailAccount" className='style-label'>
                                    {selectedOption === '11' ? 'Nombre IPTV' : 'Correo de cuenta'}
                                </label>
                                <InputText
                                    type="text"
                                    className={`form-control  form-control-lg ${errors.emailAccount ? 'p-invalid' : ''}`}
                                    name="emailAccount"
                                    {...register('emailAccount', { required: true })}
                                    style={{ width: '100%' }}
                                />
                                {errors.emailAccount && <small className="invalid-feedback">Campo requerido</small>}
                            </div>

                            <br />

                            <div style={{ width: '100%' }}>
                                <label htmlFor="passwordAccount" className='style-label'>
                                    {selectedOption === '11' ? 'Usuario' : 'Contraseña de cuenta'}
                                </label>
                                <InputText
                                    type="password"
                                    className={`form-control form-control-lg ${errors.passwordAccount ? 'is-invalid' : ''}`}
                                    name="passwordAccount"
                                    {...register('passwordAccount', { required: true })}
                                    style={{ width: '100%' }}
                                />
                                {errors.passwordAccount && <small className="invalid-feedback">Campo requerido</small>}
                            </div>

                            <br />

                            <div style={{ width: '100%' }}>
                                <label htmlFor="profileAccount" className='style-label'>
                                    {selectedOption === '11' ? 'Contraseña' : 'Perfil de cuenta'}
                                </label>
                                <InputText
                                    type="text"
                                    className={`form-control form-control-lg ${errors.profileAccount ? 'p-invalid' : ''}`}
                                    name="profileAccount"
                                    {...register('profileAccount', { required: true })}
                                    style={{ width: '100%' }}
                                />
                                {errors.profileAccount && <small className="invalid-feedback">Campo requerido</small>}
                            </div>

                            <br />

                            <div style={{ width: '100%' }}>
                                <label htmlFor="pincodeAccount" className='style-label'>
                                    {selectedOption === '11' ? 'URL' : 'Pin de perfil'}
                                </label>
                                <InputText
                                    type="text"
                                    className={`form-control form-control-lg ${errors.pincodeAccount ? 'p-invalid' : ''}`}
                                    name="pincodeAccount"
                                    {...register('pincodeAccount', { required: true })}
                                    style={{ width: '100%' }}
                                />
                                {errors.pincodeAccount && <small className="invalid-feedback">Campo requerido</small>}
                            </div>
                            <br />
                        </div>
                        {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                             <Button
                                onClick={() => onSubmit()}
                                severity='success'
                                icon ='pi pi-check'
                                style={{ fontSize: '1.2rem' }}
                                label={`Crear ${selectedOption === '11' ? 'IPTV' : 'Perfil'}`}
                            />
                </div>
                         */}
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default CreateProfile;
