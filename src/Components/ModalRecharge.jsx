import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { rechargeUserThunk } from '../features/user/userSlice'; // Adjust path if necessary, assuming it's correct
import { Check, X } from 'lucide-react';
import { addToast } from "@heroui/toast";

// eslint-disable-next-line react/prop-types
const ModalRecharge = ({ open, onClose, userData }) => {
    const dispatch = useDispatch();
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: { balance: '' }
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit = async (data) => {
        if (userData?.id) {
            setIsLoading(true);
            try {
                // Ensure balance is sent as a number if required by backend, userSlice suggests numeric
                await dispatch(rechargeUserThunk({ balance: parseFloat(data.balance) }, userData.id));
                addToast({ title: 'Éxito', description: `Se han recargado $${data.balance} a la cuenta de ${userData.username}`, color: 'success' });
                onClose();
                setValue('balance', '');
            } catch (error) {
                addToast({ title: 'Error', description: "No se pudo procesar la recarga. Intente nuevamente.", color: 'danger' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const inputClasses = {
        label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
        inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white",
        input: "text-slate-800 font-semibold",
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            size="md"
            backdrop="blur"
            scrollBehavior="inside"
            classNames={{
                base: "rounded-[2rem] border border-slate-100 shadow-xl bg-white",
                header: "border-b border-slate-100 py-6 px-8",
                body: "py-8 px-8",
                footer: "border-t border-slate-100 py-6 px-8",
                closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
            }}
        >
            <ModalContent className="overflow-hidden">
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-slate-800">Recarga de Saldo</h2>
                    {userData && (
                        <span className="text-sm font-medium text-slate-500">
                            Usuario: <span className="font-bold text-slate-700">{userData.username}</span>
                        </span>
                    )}
                </ModalHeader>
                <ModalBody>
                    <form id="recharge-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Controller
                            name="balance"
                            control={control}
                            rules={{ required: 'El monto es requerido', validate: value => parseFloat(value) !== 0 || 'El monto no puede ser 0' }}
                            render={({ field, fieldState: { error } }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    label="MONTO A RECARGAR"
                                    labelPlacement="outside"
                                    placeholder="0.00"
                                    variant="bordered"
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-slate-400 text-sm font-bold">$</span>
                                        </div>
                                    }
                                    isInvalid={!!error}
                                    errorMessage={error?.message}
                                    classNames={inputClasses}
                                />
                            )}
                        />
                    </form>
                </ModalBody>
                <ModalFooter className="flex justify-between items-center bg-white">
                    <Button
                        variant="bordered"
                        onPress={onClose}
                        isDisabled={isLoading}
                        className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs h-10 px-6 rounded-xl"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-slate-800 h-10 px-6 rounded-xl"
                        type="submit"
                        form="recharge-form"
                        isLoading={isLoading}
                        isDisabled={isLoading}
                        startContent={!isLoading && <Check size={16} />}
                    >
                        Confirmar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalRecharge;
