import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { editUserThunk } from '../features/user/userSlice';
import useErrorHandler from '../Helpers/useErrorHandler';
import { Check, User, Mail, Phone, X } from 'lucide-react';

const ModalEditUser = ({ open, onClose, recharge, data }) => {
    const { error, success } = useSelector((state) => state.error);
    const [loading, setLoading] = useState(false);

    const handleError = useErrorHandler(error, success);

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
        handleError();
    }, [error, success]);

    const inputClasses = {
        label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
        inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white",
        input: "text-slate-800 font-semibold",
    };

    return (
        <>

            <Modal
                isOpen={open}
                onClose={onClose}
                backdrop="blur"
                size="md"
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
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
                                <User size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Editar Usuario</h2>
                        </div>
                        <p className="text-sm font-medium text-slate-500 pl-11">
                            Actualiza la información del usuario en el sistema.
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <form className="flex flex-col gap-6" id="edit-user-form" onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                label="NOMBRE DE USUARIO"
                                labelPlacement="outside"
                                placeholder="Ingrese el nombre de usuario"
                                variant="bordered"
                                startContent={<User size={16} className="text-slate-400" />}
                                {...register('username', { required: true })}
                                classNames={inputClasses}
                            />
                            <Input
                                type="email"
                                label="CORREO ELECTRÓNICO"
                                labelPlacement="outside"
                                placeholder="Ingrese el correo"
                                variant="bordered"
                                startContent={<Mail size={16} className="text-slate-400" />}
                                {...register('email', { required: true })}
                                classNames={inputClasses}
                            />
                            <Input
                                type="tel"
                                label="TELÉFONO"
                                labelPlacement="outside"
                                placeholder="Ingrese un numero de telefono"
                                variant="bordered"
                                startContent={<Phone size={16} className="text-slate-400" />}
                                {...register('phone', { required: true })}
                                classNames={inputClasses}
                            />
                        </form>
                    </ModalBody>
                    <ModalFooter className="flex justify-between items-center bg-white">
                        <Button
                            variant="bordered"
                            onPress={onClose}
                            isDisabled={loading}
                            className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs h-10 px-6 rounded-xl"
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-slate-800 h-10 px-6 rounded-xl"
                            type="submit"
                            form="edit-user-form"
                            isLoading={loading}
                            isDisabled={loading}
                            startContent={!loading && <Check size={16} />}
                        >
                            Actualizar Usuario
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModalEditUser;
