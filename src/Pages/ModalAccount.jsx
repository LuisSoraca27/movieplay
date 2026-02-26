import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Input, Checkbox } from "@heroui/react";
import '../style/modalProfile.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAccountsThunk } from '../features/account/accountSlice';
import { addToast } from '@heroui/toast';
import { purchaseAccountThunk } from '../features/account/accountSlice';
import { removeError, removeSuccess } from '../features/error/errorSlice';
import CardProfilePreview from '../Components/CardProfilePreview';
import { Check, ShoppingCart } from 'lucide-react';
import { AddToCartButton } from '../Components/Cart';

const ModalAccount = ({ data, onClose, reCharge }) => {
    const dispatch = useDispatch();
    const { accounts } = useSelector(state => state.accounts);
    const { error, success } = useSelector(state => state.error);

    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [accountSelected, setAccountSelected] = useState(null);
    const [purchase, setPurchase] = useState(false);
    const [checked, setChecked] = useState(true);

    const handleSelect = (key) => {
        const selected = accounts.find(account => account.id === key);
        setAccountSelected(selected);
    };

    useEffect(() => {
        dispatch(setAccountsThunk(data?.categoryName));
    }, []);

    const handleErrors = () => {
        const isSaldoInsuficiente = error && typeof error === 'string' && error.toLowerCase().includes('saldo') && error.toLowerCase().includes('insuficiente');
        if (isSaldoInsuficiente) {
            addToast({ title: 'Saldo insuficiente', description: error, color: 'danger' });
            dispatch(removeError());
        } else if (error === 'El usuario no tiene suficiente saldo') {
            addToast({ title: 'Saldo insuficiente', description: 'No tienes suficiente saldo para adquirir esta cuenta', color: 'danger' });
            dispatch(removeError());
        } else if (!!error) {
            addToast({ title: 'Lo sentimos', description: error || 'Ha ocurrido un error, por favor intenta de nuevo', color: 'danger' });
            dispatch(removeError());
        } else if (success) {
            addToast({
                title: '¡Éxito!',
                description: 'La cuenta se ha adquirido con éxito. Los datos se han enviado a su correo electrónico',
                color: 'success',
            });
            dispatch(removeSuccess());
        }
    };

    const handleBuy = () => {
        setPurchase(true);
        if (!accountSelected) {
            addToast({ title: 'Lo sentimos', description: 'Por favor selecciona una cuenta', color: 'warning' });
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
        <Modal
            isOpen={data.total > 0 ? data.open : false}
            onClose={onClose}
            size="3xl"
            backdrop="blur"
            scrollBehavior="inside"
            classNames={{
                base: "modal-mobile-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem]",
                header: "border-b border-slate-100 dark:border-slate-800 px-5 py-4 md:p-8 md:pb-4",
                body: "px-5 py-4 md:p-8",
                footer: "border-t border-slate-100 dark:border-slate-800 px-5 py-4 md:p-8 md:pt-4",
                closeButton: "top-4 right-4 md:top-6 md:right-6 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-transform",
            }}
            motionProps={{
                variants: {
                    enter: {
                        y: 0, opacity: 1, scale: 1,
                        transition: { duration: 0.3, ease: "easeOut" },
                    },
                    exit: {
                        y: -20, opacity: 0, scale: 0.95,
                        transition: { duration: 0.2, ease: "easeIn" },
                    },
                },
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Adquirir Cuenta Completa
                            </h2>
                        </ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                {/* Left Column: Account Card Preview — compact on mobile */}
                                <div className="flex flex-col items-center justify-center md:min-h-[250px] bg-transparent md:bg-slate-50/50 md:dark:bg-slate-800/20 rounded-2xl p-0 md:p-6 border-0 md:border border-slate-100 dark:border-slate-800">
                                    <div className="transition-transform duration-500 hover:scale-105 scale-[0.65] md:scale-100 -my-4 md:my-0">
                                        <CardProfilePreview
                                            logoUrl={data?.logoUrl}
                                            displayName={data?.displayName || data?.categoryName}
                                            total={data?.total}
                                            backgroundType={data?.backgroundType || 'solid'}
                                            backgroundColor={data?.backgroundColor || '#000000'}
                                            gradientColors={data?.gradientColors || ['#000000', '#333333']}
                                            gradientDirection={data?.gradientDirection || 'to bottom'}
                                            logoSize={data?.logoSize || 'medium'}
                                            showAvailability={true}
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Selection & Checkout */}
                                <div className="flex flex-col gap-4 md:gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1">
                                            {data?.displayName || data?.categoryName}
                                        </h3>
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                            Selecciona la variante de cuenta que deseas adquirir
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <Select
                                            label="VARIANTES DE CUENTA"
                                            labelPlacement="outside"
                                            placeholder="Selecciona una cuenta"
                                            variant="flat"
                                            selectedKeys={accountSelected ? [accountSelected.id] : []}
                                            onSelectionChange={(keys) => handleSelect([...keys][0])}
                                            startContent={<ShoppingCart size={18} className="text-slate-400" />}
                                            classNames={{
                                                label: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                                                trigger: "h-14 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors",
                                                value: "text-slate-900 dark:text-white font-bold text-sm",
                                            }}
                                        >
                                            {accounts.map(account => (
                                                <SelectItem key={account.id} value={account.id}>
                                                    {account.name}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        {accountSelected && (
                                            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex justify-between items-center animate-appearance-in">
                                                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Precio Final</span>
                                                <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                                                    ${accountSelected.price.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                                        <Checkbox
                                            isSelected={checked}
                                            onValueChange={setChecked}
                                            size="sm"
                                            color="primary"
                                        >
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Enviar copia por correo</span>
                                        </Checkbox>

                                        {checked && (
                                            <div className="flex flex-col gap-3 pt-1 animate-appearance-in">
                                                <Input
                                                    type="text"
                                                    label="ASUNTO"
                                                    labelPlacement="outside"
                                                    placeholder="Opcional"
                                                    variant="flat"
                                                    size="sm"
                                                    value={subject}
                                                    onValueChange={setSubject}
                                                    classNames={{
                                                        label: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                                                        input: "text-slate-900 dark:text-white font-bold text-sm",
                                                        inputWrapper: "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                                    }}
                                                />
                                                <Input
                                                    type="email"
                                                    label="CORREO ELECTRÓNICO"
                                                    labelPlacement="outside"
                                                    placeholder="tu@correo.com"
                                                    variant="flat"
                                                    size="sm"
                                                    value={email}
                                                    onValueChange={setEmail}
                                                    classNames={{
                                                        label: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                                                        input: "text-slate-900 dark:text-white font-bold text-sm",
                                                        inputWrapper: "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="hidden md:flex p-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl gap-3 border border-slate-100 dark:border-slate-800 mt-auto">
                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                                            • La entrega de los datos es inmediata tras confirmar el pago.<br />
                                            • Verifique que su correo sea correcto si activó el envío automático.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter className="flex-col md:flex-row gap-2 md:gap-3">
                            {accountSelected && (
                                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto order-1 md:order-2">
                                    <AddToCartButton
                                        productType="account"
                                        productId={accountSelected.id}
                                        productName={`${data?.displayName || data?.categoryName} - ${accountSelected.name}`}
                                    />
                                    <Button
                                        onPress={handleBuy}
                                        isDisabled={purchase || !accountSelected}
                                        isLoading={purchase}
                                        startContent={!purchase && <Check size={18} />}
                                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold uppercase tracking-widest text-[11px] h-12 rounded-2xl shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all px-8 w-full md:w-auto"
                                    >
                                        COMPRAR
                                    </Button>
                                </div>
                            )}
                            <Button
                                variant="light"
                                onPress={onClose}
                                className="font-bold uppercase tracking-widest text-[11px] text-slate-500 dark:text-slate-400 h-12 rounded-2xl px-6 w-full md:w-auto order-2 md:order-1"
                                startContent={<i className="pi pi-times" />}
                            >
                                Cerrar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalAccount;
