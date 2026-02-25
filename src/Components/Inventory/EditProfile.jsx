import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { useDispatch, useSelector } from 'react-redux';
import { editProfileThunk } from '../../features/user/profileSlice';
import { addToast } from "@heroui/toast";
import { Check } from 'lucide-react';

const EditProfile = ({ data, show, onClose, reCharge }) => {
    const dispatch = useDispatch();
    const { error, success } = useSelector((state) => state.error);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            price: '',
            durationOfService: '',
            emailAccount: '',
            passwordAccount: '',
            profileAccount: '',
            pincodeAccount: ''
        }
    });

    useEffect(() => {
        if (data) {
            reset({
                name: data.name || '',
                description: data.description || '',
                price: data.price ? String(data.price) : '',
                durationOfService: data.durationOfService ? String(data.durationOfService) : '',
                emailAccount: data.emailAccount || '',
                passwordAccount: data.passwordAccount || '',
                profileAccount: data.profileAccount || '',
                pincodeAccount: data.pincodeAccount || ''
            });
        }
    }, [data, reset]);

    useEffect(() => {
        if (error) addToast({ title: 'Error', description: error, color: 'danger' });
        if (success) addToast({ title: 'Éxito', description: success, color: 'success' });
    }, [error, success]);

    const onSubmit = (formData) => {
        setLoading(true);
        dispatch(editProfileThunk(data.id, formData))
            .then(() => {
                reCharge();
                onClose();
                setLoading(false);
            });
    };

    const inputClasses = {
        label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
        inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white",
        input: "text-slate-800 font-semibold",
    };

    return (
        <Modal
            isOpen={show}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
            classNames={{
                base: "rounded-[2rem] border border-slate-100 shadow-2xl safe-area-y",
                header: "border-b border-slate-100 py-4",
                footer: "border-t border-slate-100 py-4",
                closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
            }}
        >
            <ModalContent className="bg-white">
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-slate-800">Editar Perfil</h2>
                    <span className="text-sm font-medium text-slate-500">Actualiza la información del perfil seleccionado</span>
                </ModalHeader>
                <ModalBody className="py-6">
                    <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <Input
                                    label="NOMBRE"
                                    placeholder="Nombre del perfil"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    isInvalid={!!errors.name}
                                    errorMessage={errors.name?.message}
                                    classNames={inputClasses}
                                    {...register("name", { required: "Campo requerido" })}
                                />
                                <Input
                                    label="DESCRIPCIÓN"
                                    placeholder="Descripción"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    isInvalid={!!errors.description}
                                    errorMessage={errors.description?.message}
                                    classNames={inputClasses}
                                    {...register("description", { required: "Campo requerido" })}
                                />
                                <Input
                                    type="number"
                                    label="PRECIO"
                                    placeholder="Precio"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    startContent={<div className="pointer-events-none flex items-center"><span className="text-slate-400 text-small font-bold">$</span></div>}
                                    isInvalid={!!errors.price}
                                    errorMessage={errors.price?.message}
                                    classNames={{
                                        ...inputClasses,
                                        input: "text-slate-800 font-bold"
                                    }}
                                    {...register("price", { required: "Campo requerido" })}
                                />
                                <Input
                                    type="number"
                                    label="DURACIÓN (DÍAS)"
                                    placeholder="Días"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    isInvalid={!!errors.durationOfService}
                                    errorMessage={errors.durationOfService?.message}
                                    classNames={inputClasses}
                                    {...register("durationOfService", { required: "Campo requerido" })}
                                />
                            </div>
                            <div className="space-y-4">
                                <Input
                                    label="CORREO CUENTA"
                                    placeholder="Correo"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    isInvalid={!!errors.emailAccount}
                                    errorMessage={errors.emailAccount?.message}
                                    classNames={inputClasses}
                                    {...register("emailAccount", { required: "Campo requerido" })}
                                />
                                <Input
                                    label="CONTRASEÑA"
                                    placeholder="Contraseña"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    isInvalid={!!errors.passwordAccount}
                                    errorMessage={errors.passwordAccount?.message}
                                    classNames={inputClasses}
                                    {...register("passwordAccount", { required: "Campo requerido" })}
                                />
                                <Input
                                    label="PERFIL DE CUENTA"
                                    placeholder="Perfil"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    isInvalid={!!errors.profileAccount}
                                    errorMessage={errors.profileAccount?.message}
                                    classNames={inputClasses}
                                    {...register("profileAccount", { required: "Campo requerido" })}
                                />
                                <Input
                                    label="PIN DE PERFIL"
                                    placeholder="Pin"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    isInvalid={!!errors.pincodeAccount}
                                    errorMessage={errors.pincodeAccount?.message}
                                    classNames={inputClasses}
                                    {...register("pincodeAccount", { required: "Campo requerido" })}
                                />
                            </div>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="bordered"
                        onPress={onClose}
                        className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-slate-800"
                        type="submit"
                        form="edit-profile-form"
                        isLoading={loading}
                        startContent={!loading && <Check size={18} />}
                    >
                        Actualizar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditProfile;
