import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@heroui/react";
import { useDispatch, useSelector } from 'react-redux';
import { editAccountThunk } from '../../features/account/accountSlice';
import useErrorHandler from '../../Helpers/useErrorHandler';
import { Check } from 'lucide-react';

const EditAccount = ({ data, show, onClose, reCharge }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        durationOfService: '',
        emailAccount: '',
        passwordAccount: ''
    });
    const dispatch = useDispatch();
    const { success, error } = useSelector((state) => state.error);

    const handleErrors = useErrorHandler(error, success);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || '',
                description: data.description || '',
                price: data.price || '',
                durationOfService: data.durationOfService || '',
                emailAccount: data.emailAccount || '',
                passwordAccount: data.passwordAccount || ''
            });
        }
    }, [data]);

    useEffect(() => {
        handleErrors();
    }, [error, success]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        dispatch(editAccountThunk(data.id, form))
            .then(() => {
                onClose();
                reCharge();
                setLoading(false);
            });
    };

    const inputClasses = {
        label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
        inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white",
        input: "text-slate-800 font-semibold",
    };

    return (
        <>
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
                        <h2 className="text-xl font-bold text-slate-800">Editar Cuenta</h2>
                        <span className="text-sm font-medium text-slate-500">Actualiza la información de la cuenta seleccionada</span>
                    </ModalHeader>
                    <ModalBody className="gap-6 py-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <Input
                                label="NOMBRE"
                                name="name"
                                placeholder="Escribe el nombre del perfil"
                                value={form.name}
                                onChange={handleChange}
                                variant="bordered"
                                labelPlacement="outside"
                                isRequired
                                classNames={inputClasses}
                            />
                            <Textarea
                                label="DESCRIPCIÓN"
                                name="description"
                                placeholder="Escribe la descripción del perfil"
                                value={form.description}
                                onChange={handleChange}
                                variant="bordered"
                                labelPlacement="outside"
                                minRows={3}
                                isRequired
                                classNames={inputClasses}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="number"
                                    label="PRECIO"
                                    name="price"
                                    placeholder="0.00"
                                    value={form.price}
                                    onChange={handleChange}
                                    variant="bordered"
                                    labelPlacement="outside"
                                    startContent={
                                        <span className="text-slate-400 text-sm font-bold">$</span>
                                    }
                                    isRequired
                                    classNames={{
                                        ...inputClasses,
                                        input: "text-slate-800 font-bold"
                                    }}
                                />
                                <Input
                                    type="number"
                                    label="DURACIÓN (DÍAS)"
                                    name="durationOfService"
                                    placeholder="30"
                                    value={form.durationOfService}
                                    onChange={handleChange}
                                    variant="bordered"
                                    labelPlacement="outside"
                                    isRequired
                                    classNames={inputClasses}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="CORREO"
                                    name="emailAccount"
                                    placeholder="correo@cuenta.com"
                                    value={form.emailAccount}
                                    onChange={handleChange}
                                    variant="bordered"
                                    labelPlacement="outside"
                                    isRequired
                                    classNames={inputClasses}
                                />
                                <Input
                                    label="CONTRASEÑA"
                                    name="passwordAccount"
                                    placeholder="••••••••"
                                    value={form.passwordAccount}
                                    onChange={handleChange}
                                    variant="bordered"
                                    labelPlacement="outside"
                                    isRequired
                                    classNames={inputClasses}
                                />
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
                            onPress={handleSubmit}
                            isLoading={loading}
                            isDisabled={loading}
                            startContent={!loading && <Check size={16} />}
                        >
                            Actualizar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditAccount;
