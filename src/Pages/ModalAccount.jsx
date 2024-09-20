import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import '../style/modalProfile.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAccountsThunk } from '../features/account/accountSlice';
import Swal from 'sweetalert2';
import { purchaseAccountThunk } from '../features/account/accountSlice';
import { removeError, removeSuccess } from '../features/error/errorSlice';
import CardProfile from '../Components/CardProfile';

const ModalAccount = ({ data, onClose, reCharge }) => {
    const dispatch = useDispatch();
    const { accounts } = useSelector(state => state.accounts);
    const { error, success } = useSelector(state => state.error);

    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [accountSelected, setAccountSelected] = useState(null);
    const [purchase, setPurchase] = useState(false);
    // Estado para controllar el checkbox
    const [checked, setChecked] = useState(false);

    const handleSelect = (e) => {
        const accountId = e.target.value;
        const selected = accounts.find(account => account.id === accountId);
        setAccountSelected(selected);
    };

    useEffect(() => {
        dispatch(setAccountsThunk(data?.categoryName));
    }, []);

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
        } else if (success) {
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
        if (!accountSelected) {
            Swal.fire({
                icon: 'error',
                title: 'Lo sentimos',
                text: 'Por favor selecciona una cuenta',
            });
            setPurchase(false);
        } else {
            dispatch(purchaseAccountThunk(accountSelected.id, email, subject))
                .finally(() => {
                    setPurchase(false);
                    onClose();
                    reCharge();
                });
        }
    };

    useEffect(() => {
        handleErrors();
    }, [error, success]);

    return (
        <Dialog
            visible={data.total > 0 ? data.open : false}
            onHide={onClose}
            header={`Adquirir ${data?.title}`}
            modal
            className="modal_profile"
            footer={
                <div>
                    <Button
                        label={purchase ? 'Procesando...' : 'Comprar'}
                        icon="pi pi-check"
                        onClick={handleBuy}
                        disabled={purchase}
                    />
                </div>
            }
        >
            <div className="container_modal_profile">
                <div className="container_img">
                    <CardProfile
                        img={data?.img}
                        title={data?.title}
                        total={data?.total}
                        background={data?.background}
                    />
                </div>
                <div className="container_info">
                    <h2 className="title-card">{data?.title}</h2>
                    <p style={{ fontSize: '17px', fontWeight: '500' }}>Por favor, seleccione la cuenta a comprar</p>
                    <div className="profile">
                        <Dropdown
                            value={accountSelected ? accountSelected.id : ''}
                            onChange={(e) => handleSelect(e)}
                            options={accounts.map(account => ({ label: account.name, value: account.id }))}
                            placeholder="Seleccionar Cuenta"
                            className="dropdown_profile" 
                            optionLabel="label"
                            
                        />
                        {accountSelected && (
                            <div className="profile-value">
                                Valor Cuenta seleccionada: <strong>{accountSelected.price}</strong>
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
                                <br />
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
    );
};

export default ModalAccount;
