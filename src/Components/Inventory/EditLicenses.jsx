import { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@heroui/react";
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { editLicenseThunk } from '../../features/license/licenseSlice';
import { addToast } from "@heroui/toast";
import { Check } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const EditLicenses = ({ show, onClose, dataLicense, reCharge }) => {
    const dispatch = useDispatch()
    const { success, error } = useSelector((state) => state.error);
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false);

    const onSubmit = (data) => {
        setLoading(true);
        dispatch(editLicenseThunk(data.id, data))
            .then(() => {
                onClose();
                reCharge();
                reset();
                setLoading(false);
            });
    };

    useEffect(() => {
        if (dataLicense) {
            reset({
                ...dataLicense,
                price: parseInt(dataLicense.price)
            });
        }
    }, [dataLicense, reset]);

    useEffect(() => {
        if (error) addToast({ title: 'Error', description: error, color: 'danger' });
        if (success) addToast({ title: 'Éxito', description: success, color: 'success' });
    }, [success, error]);

    const inputClasses = {
        label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
        inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white",
        input: "text-slate-800 font-semibold",
    };

    return (
        <Modal
            isOpen={show}
            onClose={onClose}
            size="lg"
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
                    <h2 className="text-xl font-bold text-slate-800">Editar Licencia/APK</h2>
                    <span className="text-sm font-medium text-slate-500">Actualiza la información del servicio seleccionado</span>
                </ModalHeader>
                <ModalBody className="py-6">
                    <form id="edit-license-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="NOMBRE"
                            placeholder="Nombre de la licencia"
                            variant="bordered"
                            labelPlacement="outside"
                            isInvalid={!!errors.name}
                            errorMessage={errors.name?.message}
                            classNames={inputClasses}
                            {...register("name", {
                                required: "El nombre es requerido",
                                minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres" },
                                maxLength: { value: 240, message: "El nombre debe tener menos de 240 caracteres" }
                            })}
                        />

                        <Textarea
                            label="DESCRIPCIÓN"
                            placeholder="Descripción de la licencia"
                            variant="bordered"
                            labelPlacement="outside"
                            minRows={2}
                            isInvalid={!!errors.description}
                            errorMessage={errors.description?.message}
                            classNames={inputClasses}
                            {...register("description", {
                                required: "La descripción es requerida",
                                minLength: { value: 3, message: "La descripción debe tener al menos 3 caracteres" },
                                maxLength: { value: 240, message: "La descripción debe tener menos de 240 caracteres" },
                            })}
                        />

                        <Input
                            type="number"
                            label="PRECIO"
                            placeholder="0.00"
                            variant="bordered"
                            labelPlacement="outside"
                            startContent={<div className="pointer-events-none flex items-center"><span className="text-slate-400 text-small font-bold">$</span></div>}
                            isInvalid={!!errors.price}
                            errorMessage={errors.price?.message}
                            classNames={{
                                ...inputClasses,
                                input: "text-slate-800 font-bold"
                            }}
                            {...register("price", {
                                required: "El precio es requerido",
                            })}
                        />
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
                        form="edit-license-form"
                        isLoading={loading}
                        startContent={!loading && <Check size={18} />}
                    >
                        Confirmar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditLicenses;