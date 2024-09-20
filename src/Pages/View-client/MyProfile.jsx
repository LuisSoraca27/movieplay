import '../../style/MyProfile.css';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { editUserThunk, getHistoryRecharge, getUserSession } from '../../features/user/userSlice';
import { useForm } from 'react-hook-form';
import useErrorHandler from '../../Helpers/useErrorHandler';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
        
        
const MyProfile = () => {

    const toast = useRef(null);
    const dispatch = useDispatch()
    const { userSession, historyRecharge } = useSelector((state) => state.user)
    const { error, success } = useSelector((state) => state.error)
    const handleError = useErrorHandler(error, success)
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue, formState: { isDirty } } = useForm();

    const onSubmit = (formData) => {
      setLoading(true);
      dispatch(editUserThunk(formData, userSession.id))
        .then(() => {
          setIsEditing(false);
          setValue('username', '');
          setValue('email', '');
          setValue('phone', '');
          setLoading(false);
          dispatch(getUserSession())
        })
    }

    useEffect(() => {
      dispatch(getUserSession())
      dispatch(getHistoryRecharge('93'))
    }, [dispatch])

    useEffect(() => {
      setValue('username', userSession?.username || ''); 
      setValue('email', userSession?.email || '');
      setValue('phone', userSession?.phone || '');
    }, [userSession]);

    useEffect(() => {
      handleError(toast.current);
    }, [handleError])

    return (
        <>
        <Toast ref={toast} />
        <div className="my-profile">
            <Fieldset legend="Mi perfil">
             <div style={{ textAlign: 'left', marginTop: '5px', width: '100%', display: 'flex',
             flexDirection: 'row', gap: '10px', justifyContent: 'space-between', flexWrap: 'wrap'}}>
               {isEditing ? (
                    <>
                    <div>
                    <label htmlFor="username" style={{fontWeight: 'bold'}}>Nombre de usuario</label>
                    <br />
                    <span className="p-input-icon-left">
                      <i className="pi pi-user" />
                      <InputText id="username"
                        {...register("username", { required: true })}
                        />
                    </span>
                    </div>
                      <div>
                      <label htmlFor="email" style={{fontWeight: 'bold'}}>Correo electrónico</label>
                      <br />
                      <span className="p-input-icon-left">
                      <i className="pi pi-envelope" />
                      <InputText id="email"
                        {...register("email", { required: true })}
                        />
                    </span>
                      </div>
                      <div>
                      <label htmlFor="phone" style={{fontWeight: 'bold'}}>Numero de teléfono</label>
                      <br />
                      <span className="p-input-icon-left">
                      <i className="pi pi-phone" />
                      <InputText id="phone"
                        {...register("phone", { required: true })}
                        />
                    </span>
                      </div>

                    </>
               ): (
                    <>
                      <p className='text-profile'>
                        <i className="pi pi-user"></i>
                         <strong>Nombre de usuario:</strong> 
                         <br />
                         <small>{userSession?.username}</small>
                    </p>
                    <p className='text-profile'>
                        <i className="pi pi-envelope"></i>
                        <strong>Correo electrónico: </strong>
                        <br />
                       <small>{userSession?.email}</small>
                    </p>
                    <p className='text-profile'>
                        <i className="pi pi-phone"></i>
                         <strong>Numero de teléfono:</strong>
                        <br />
                         <small>{userSession?.phone}</small>
                    </p>
                    </>
               )}
             </div>
             <Button label={isEditing ? 'Confirmar' : 'Editar'} icon="pi pi-pencil" className="p-button-rounded p-button-info" 
             disabled={loading} loading={loading}
             style={{  marginTop: '20px'}}
             onClick={() => {
               if (!isEditing) {
                 setIsEditing(true);
               } else {
                 handleSubmit(onSubmit)();
               }
             }}
             />
             {
               isEditing && (
                <Button label="Cancelar" icon="pi pi-times" className="p-button-rounded p-button-danger"
                style={{  marginTop: '20px', marginLeft: '10px'}}
                onClick={() => setIsEditing(false)}
                />
               )
             }
            </Fieldset>
            <br />
            <br />
            <br />
            <Fieldset legend="Mi historial de recargas">
            <DataTable value={historyRecharge} responsiveLayout="scroll" paginator rows={10} >
                <Column field="balance" header="Monto" />
                <Column field="createdAt" header="Fecha"
                 body={(rowData) => {
                  const createdAt = new Date(rowData.createdAt);
                  return `${createdAt.getDate()} de ${createdAt.toLocaleString('es-ES', {
                      month: 'long'
                  })} de ${createdAt.getFullYear()}, a las ${createdAt.getHours()}:${createdAt.getMinutes()}`;
              }}
                />
            </DataTable>
            </Fieldset>

        </div>
        </>
    );
};

export default MyProfile;