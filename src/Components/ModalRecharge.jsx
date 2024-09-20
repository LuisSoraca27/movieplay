import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { rechargeUserThunk } from '../features/user/userSlice';

const ModalRecharge = ({ open, onClose, recharge, idUser }) => {
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = (data) => {
        dispatch(rechargeUserThunk({ balance: data.balance }, idUser))
            .then(() => {
                setValue('balance', 0);
                Swal.fire({
                    icon: 'success',
                    title: 'Recarga exitosa',
                    text: 'El saldo se ha recargado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .finally(() => {
                recharge();
            });
        onClose();
        setValue('balance', 0);
    };

    return (
        <Dialog
            visible={open}
            onHide={onClose}
            className="p-fluid"
            header="Recarga saldo"
            footer={
                <div>
                    <Button label="Confirmar" icon="pi pi-check" severity='success' onClick={handleSubmit(onSubmit)} />
                </div>
            }
        >
            <div style={{ padding: '0px' }}>
                <form>
                    <div className="row">
                        <div className="mb-2">
                            <InputText
                                id="balance"
                                type="number"
                                name="balance"
                                placeholder="Saldo a recargar"
                                {...register('balance', { required: true })}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Dialog>
    );
};

export default ModalRecharge;
