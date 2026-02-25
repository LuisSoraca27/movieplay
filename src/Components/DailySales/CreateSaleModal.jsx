import React, { useState } from 'react';
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Select, SelectItem, DatePicker
} from "@heroui/react";
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { createDailySale } from '../../features/DailySale/dailySaleSlice';
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";
import { X, Check } from 'lucide-react';
import FileUpload from '../ui/FileUpload';

const CreateSaleModal = ({ visible, onHide, searchTerm }) => {
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        defaultValues: {
            customerName: '',
            customerId: '',
            whatsapp: '',
            email: '',
            product: '',
            paymentMethod: null,
            reference: '',
            seller: '',
            amount: 0,
            createdAt: new Date()
        }
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const paymentMethods = [
        { label: "Bancolombia", value: "bancolombia" },
        { label: "Nequi", value: "nequi" },
        { label: "Daviplata", value: "Daviplata" },
        { label: "Ahorro a la mano", value: "ahorro a la mano" },
        { label: "Qr Bancolombia", value: "qr bancolombia" },
        { label: "Transfiya", value: "transfiya" },
        { label: "Pse", value: "pse" },
        { label: "Binance", value: "binance" },
        { label: "PayPal", value: "paypal" },
        { label: "Wompi", value: "wompi" },
        { label: "Efectivo", value: "efectivo" },
    ];

    const handleFormSubmit = (data) => {
        setLoading(true);
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (key !== 'receipt' && data[key] !== null && data[key] !== '') {
                if (key === 'createdAt' && data[key] instanceof Date) {
                    formData.append(key, data[key].toISOString());
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        if (selectedFile) {
            formData.append('receipt', selectedFile);
        }

        dispatch(createDailySale(formData, searchTerm.toISOString())).then(() => {
            setLoading(false);
            reset();
            setSelectedFile(null);
            onHide();
        });
    };

    const handleHide = () => {
        reset();
        setSelectedFile(null);
        onHide();
    };

    const handleDateChange = (calendarDate) => {
        if (calendarDate) {
            const jsDate = new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
            setValue('createdAt', jsDate);
        }
    };

    const getCalendarDate = () => {
        const currentValue = watch('createdAt');
        if (currentValue instanceof Date) {
            return parseDate(currentValue.toISOString().split('T')[0]);
        }
        return today(getLocalTimeZone());
    };

    const inputClasses = {
        label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
        inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white",
        input: "text-slate-800 font-semibold",
    };

    return (
        <Modal
            isOpen={visible}
            onClose={handleHide}
            size="4xl"
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
                    <h2 className="text-xl font-bold text-slate-800">Nueva Venta</h2>
                    <span className="text-sm font-medium text-slate-500">Registra una nueva venta diaria en el sistema</span>
                </ModalHeader>
                <ModalBody className="gap-6 py-6">
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {/* Left Column */}
                            <div className="flex flex-col gap-4">
                                <Controller
                                    name="customerName"
                                    control={control}
                                    rules={{ required: 'Nombre del cliente es requerido.' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="CLIENTE"
                                            placeholder="Nombre completo"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            isRequired
                                            isInvalid={!!errors.customerName}
                                            errorMessage={errors.customerName?.message}
                                            classNames={inputClasses}
                                        />
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Controller
                                        name="customerId"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="ID (OPCIONAL)"
                                                placeholder="Documento"
                                                variant="bordered"
                                                labelPlacement="outside"
                                                classNames={inputClasses}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="whatsapp"
                                        control={control}
                                        rules={{ required: 'WhatsApp es requerido.' }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="WHATSAPP"
                                                placeholder="Ej: 3001234567"
                                                variant="bordered"
                                                labelPlacement="outside"
                                                type="tel"
                                                isRequired
                                                isInvalid={!!errors.whatsapp}
                                                errorMessage={errors.whatsapp?.message}
                                                classNames={inputClasses}
                                            />
                                        )}
                                    />
                                </div>


                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message: "Email inválido"
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="EMAIL (OPCIONAL)"
                                            placeholder="correo@ejemplo.com"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            type="email"
                                            isInvalid={!!errors.email}
                                            errorMessage={errors.email?.message}
                                            classNames={inputClasses}
                                        />
                                    )}
                                />

                                <Controller
                                    name="product"
                                    control={control}
                                    rules={{ required: 'Producto es requerido.' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="PRODUCTO"
                                            placeholder="Nombre del producto"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            isRequired
                                            isInvalid={!!errors.product}
                                            errorMessage={errors.product?.message}
                                            classNames={inputClasses}
                                        />
                                    )}
                                />

                                <DatePicker
                                    label="FECHA VENTA"
                                    value={getCalendarDate()}
                                    onChange={handleDateChange}
                                    maxValue={today(getLocalTimeZone())}
                                    variant="bordered"
                                    labelPlacement="outside"
                                    isRequired
                                    classNames={inputClasses}
                                />
                            </div>

                            {/* Right Column */}
                            <div className="flex flex-col gap-4">
                                <Controller
                                    name="paymentMethod"
                                    control={control}
                                    rules={{ required: 'Método de pago es requerido.' }}
                                    render={({ field }) => (
                                        <Select
                                            label="MÉTODO DE PAGO"
                                            placeholder="Seleccione uno"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            isRequired
                                            selectedKeys={field.value ? [field.value] : []}
                                            onSelectionChange={(keys) => field.onChange([...keys][0])}
                                            isInvalid={!!errors.paymentMethod}
                                            errorMessage={errors.paymentMethod?.message}
                                            classNames={{
                                                ...inputClasses,
                                                trigger: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white"
                                            }}
                                        >
                                            {paymentMethods.map((method) => (
                                                <SelectItem key={method.value} textValue={method.label}>
                                                    {method.label}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Controller
                                        name="reference"
                                        control={control}
                                        rules={{ required: 'Referencia es requerida.' }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="REFERENCIA"
                                                placeholder="# Ref"
                                                variant="bordered"
                                                labelPlacement="outside"
                                                isRequired
                                                isInvalid={!!errors.reference}
                                                errorMessage={errors.reference?.message}
                                                classNames={inputClasses}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="amount"
                                        control={control}
                                        rules={{ required: 'Monto es requerido.' }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="MONTO"
                                                placeholder="0"
                                                variant="bordered"
                                                labelPlacement="outside"
                                                type="number"
                                                isRequired
                                                value={field.value?.toString() || ''}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                startContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-slate-400 text-small font-bold">$</span>
                                                    </div>
                                                }
                                                isInvalid={!!errors.amount}
                                                errorMessage={errors.amount?.message}
                                                classNames={{
                                                    ...inputClasses,
                                                    input: "text-slate-800 font-bold"
                                                }}
                                            />
                                        )}
                                    />
                                </div>

                                <Controller
                                    name="seller"
                                    control={control}
                                    rules={{ required: 'Vendedor es requerido.' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="VENDEDOR"
                                            placeholder="Nombre del vendedor"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            isRequired
                                            isInvalid={!!errors.seller}
                                            errorMessage={errors.seller?.message}
                                            classNames={inputClasses}
                                        />
                                    )}
                                />

                                <div className="flex flex-col gap-2 mt-2">
                                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">COMPROBANTE (OPCIONAL)</span>
                                    <FileUpload
                                        onFileSelect={setSelectedFile}
                                        accept="image/*"
                                        label="Subir imagen"
                                        showPreview={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="bordered"
                        onPress={handleHide}
                        className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-slate-800"
                        onPress={handleSubmit(handleFormSubmit)}
                        isLoading={loading}
                        isDisabled={loading}
                        startContent={!loading && <Check size={16} />}
                    >
                        Crear Venta
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

CreateSaleModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    searchTerm: PropTypes.instanceOf(Date).isRequired
};

export default CreateSaleModal;