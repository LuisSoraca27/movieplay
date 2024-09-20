import  { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import '../style/modalProfile.css';
import { useSelector, useDispatch } from 'react-redux';
import { setProfilesThunk, purchaseProfileThunk } from '../features/user/profileSlice';
import Swal from 'sweetalert2';
import { removeError, removeSuccess } from '../features/error/errorSlice';
import CardProfile from '../Components/CardProfile';


const ModalProfile = ({ data, onClose, reCharge }) => {

    const dispatch = useDispatch();
    const { profiles } = useSelector(state => state.profiles);
    const { error, success } = useSelector(state => state.error);

    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [profileSelected, setProfileSelected] = useState(null);
    const [purchase, setPurchase] = useState(false);
    // Estado para controllar el checkbox
    const [checked, setChecked] = useState(false);


    const getOptions = () => profiles.map(profile => ({ label: profile.name, value: profile.id }));

    const handleSelect = (e) => {
        const profileId = e.target.value;
        const selected = profiles.find(profile => profile.id === profileId);
        setProfileSelected(selected);
    }

    const handleErrors = () => {
        if (error === 'El usuario no tiene suficiente saldo') {
            Swal.fire({
                icon: 'error',
                title: 'Lo sentimos',
                text: 'No tienes suficiente saldo para adquirir esta cuenta',
            });
            dispatch(removeError());
        } else if (!!error) {
            Swal.fire({
                icon: 'error',
                title: 'Lo sentimos',
                text: 'Ha ocurrido un error, por favor intenta de nuevo',
            });
            dispatch(removeError());
        }
        else if (success) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'La cuenta se ha adquirido con éxito, Los datos de la cuenta se han enviado a su correo electrónico',
                confirmButtonText: 'Aceptar',
            });
            dispatch(removeSuccess());
        }
    };

    const handleBuy = () => {
        setPurchase(true);
        if (!profileSelected) {
            onClose();
            Swal.fire({
                icon: 'error',
                title: 'Lo sentimos',
                text: 'Por favor selecciona un perfil',
            });
        } else {
            dispatch(purchaseProfileThunk(profileSelected.id, email, subject))
                .finally(() => {
                    setPurchase(false);
                    setEmail('');
                    onClose();
                    reCharge();
                }
                );

        }

    };



    useEffect(() => {
        handleErrors();
        dispatch(setProfilesThunk(data?.categoryName));
    }, [error, success]);

    return (
        <div>
          <Dialog
            header={`Adquirir ${data?.title}`}
            visible={data.total > 0 ? data.open : false}
            onHide={onClose}
            
            className='modal_profile'
            footer={
              <div>
                <Button
                  label="Comprar"
                  icon="pi pi-check"
                  onClick={handleBuy}
                  disabled={purchase}
                  loading={purchase}
                />
              </div>
            }
          >
            <div className="container_modal_profile">
              <div className="container_img">
                <CardProfile
                 total={data?.total}
                 img={data?.img}
                 title={data?.title}
                 background={data?.categoryName}
                />
              </div>
              <div className="container_info">
                <h2 className="title-card">{data?.title}</h2>
                <p style={{ fontSize: '17px', fontWeight: '500' }}>Por favor, seleccione el perfil a comprar</p>
                <div className="profile">
               <Dropdown 
               value={profileSelected ? profileSelected.id : ''}
                onChange={(e) => handleSelect(e)}
                 options={getOptions()}
                placeholder="Seleccionar Perfil" 
                className="dropdown_profile" 
                optionLabel="label"
                /> 
                  {profileSelected && (
                    <div className="profile-value">
                      Valor Perfil seleccionado: <strong>{profileSelected.price}</strong>
                    </div>
                  )}
                </div>
                <form className="email-tercero" style={{ width: '370px', textAlign: 'start' }}>
                  {!checked && (
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="checkbox"
                        name="checkbox"
                        checked={checked}
                        onChange={() => setChecked(!checked)}
                      />
                      <label className="checkbox-label" htmlFor="checkbox">
                        Deseo enviar una copia de los datos de la compra
                      </label>
                    </div>
                  )}
                  {checked && (
                   <div className="copia-email hidden animation-duration-500 box">
                    <label htmlFor="username">Asunto</label>
  <InputText
    type="text"
    placeholder="Asunto (opcional)"
    className="input-email"
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
  />
  <br/>
  <br />
   <label htmlFor="username">Correo electrónico</label>
  <InputText
    type="email"
    placeholder="Correo electrónico"
    className="input-email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

                  )}
                </form>
                <p>Al realizar el pedido, aceptas nuestros <b>Términos de Uso</b>.</p>
                <ul>
                  <li>Guía de condiciones de uso restricciones y Garantía.</li>
                  <li>No se aceptan devoluciones ni se hacen reembolsos de este producto.</li>
                </ul>
              </div>
            </div>
          </Dialog>
        </div>
      );      
};

export default ModalProfile;
