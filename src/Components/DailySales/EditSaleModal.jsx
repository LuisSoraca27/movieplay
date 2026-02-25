import React, { useState, useEffect } from 'react';
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Select, SelectItem, DatePicker
} from "@heroui/react";
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { updateDailySale } from '../../features/DailySale/dailySaleSlice';
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";
import { X, Check } from 'lucide-react';
import FileUpload from '../ui/FileUpload';

const EditSaleModal = ({ visible, onHide, saleData, searchTerm }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        customerName: '',
        customerId: '',
        whatsapp: '',
        email: '',
        product: '',
        paymentMethod: '',
        reference: '',
        seller: '',
        amount: 0,
        createdAt: new Date()
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const paymentMethods = [
        { label: 'Efectivo', value: 'efectivo' },
        { label: 'Transferencia', value: 'transferencia' },
        { label: 'Tarjeta', value: 'tarjeta' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'Otro', value: 'otro' }
    ];

    useEffect(() => {
        if (saleData && visible) {
            setFormData({
                customerName: saleData.customerName || '',
                customerId: saleData.customerId || '',
                whatsapp: saleData.whatsapp || '',
                email: saleData.email || '',
                product: saleData.product || '',
                paymentMethod: saleData.paymentMethod || '',
                reference: saleData.reference || '',
                seller: saleData.seller || '',
                amount: saleData.amount || 0,
                createdAt: saleData.createdAt ? new Date(saleData.createdAt) : new Date()
            });
            setSelectedFile(null);
        }
    }, [saleData, visible]);

    useEffect(() => {
        if (!visible) {
            resetForm();
        }
    }, [visible]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDateChange = (calendarDate) => {
        if (calendarDate) {
            const jsDate = new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
            handleInputChange('createdAt', jsDate);
        }
    };

    const getCalendarDate = () => {
        if (formData.createdAt instanceof Date) {
            return parseDate(formData.createdAt.toISOString().split('T')[0]);
        }
        return today(getLocalTimeZone());
    };

    const handleSubmit = async () => {
        if (!formData.customerName || !formData.product || !formData.seller || !formData.amount || !formData.createdAt) {
            return;
        }

        setIsLoading(true);

        try {
            const updateData = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === 'createdAt' && formData[key] instanceof Date) {
                    updateData.append(key, formData[key].toISOString());
                } else {
                    updateData.append(key, formData[key]);
                }
            });

            if (selectedFile) {
                updateData.append('receipt', selectedFile);
            }

            await dispatch(updateDailySale({
                id: saleData.id,
                formData: updateData,
                searchDate: searchTerm.toISOString()
            }));

            onHide();

        } catch (error) {
            console.error('Error al actualizar venta:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            customerName: '',
            customerId: '',
            whatsapp: '',
            email: '',
            product: '',
            paymentMethod: '',
            reference: '',
            seller: '',
            amount: 0,
            createdAt: new Date()
        });
        setSelectedFile(null);
    };

    const inputClasses = {
        label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
        inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white",
        input: "text-slate-800 font-semibold",
    };

    return (
        <Modal
            isOpen={visible}
            onClose={onHide}
            size="2xl"
            scrollBehavior="inside"
            isDismissable
            classNames={{
                base: "rounded-[2rem] border border-slate-100 shadow-2xl safe-area-y",
                header: "border-b border-slate-100 py-4",
                footer: "border-t border-slate-100 py-4",
                closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
            }}
        >
            <ModalContent className="bg-white">
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-slate-800">Editar Venta</h2>
                    <span className="text-sm font-medium text-slate-500">Actualiza la información de la venta seleccionada</span>
                </ModalHeader>
                <ModalBody className="gap-6 py-6">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-6">
                        <Input
                            label="CLIENTE"
                            placeholder="Ingrese el nombre del cliente"
                            variant="bordered"
                            labelPlacement="outside"
                            value={formData.customerName}
                            onChange={(e) => handleInputChange('customerName', e.target.value)}
                            isRequired
                            classNames={inputClasses}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="ID (OPCIONAL)"
                                placeholder="ID del cliente"
                                variant="bordered"
                                labelPlacement="outside"
                                value={formData.customerId}
                                onChange={(e) => handleInputChange('customerId', e.target.value)}
                                classNames={inputClasses}
                            />
                            <Input
                                label="WHATSAPP"
                                placeholder="Número de WhatsApp"
                                variant="bordered"
                                labelPlacement="outside"
                                value={formData.whatsapp}
                                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                                classNames={inputClasses}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="EMAIL (OPCIONAL)"
                                placeholder="Correo electrónico"
                                variant="bordered"
                                labelPlacement="outside"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                classNames={inputClasses}
                            />
                            <Input
                                label="PRODUCTO"
                                placeholder="Nombre del producto"
                                variant="bordered"
                                labelPlacement="outside"
                                value={formData.product}
                                onChange={(e) => handleInputChange('product', e.target.value)}
                                isRequired
                                classNames={inputClasses}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                            <Select
                                label="MÉTODO DE PAGO"
                                placeholder="Seleccione método"
                                variant="bordered"
                                labelPlacement="outside"
                                selectedKeys={formData.paymentMethod ? [formData.paymentMethod] : []}
                                onSelectionChange={(keys) => handleInputChange('paymentMethod', [...keys][0] || '')}
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="REFERENCIA"
                                placeholder="Ref"
                                variant="bordered"
                                labelPlacement="outside"
                                value={formData.reference}
                                onChange={(e) => handleInputChange('reference', e.target.value)}
                                classNames={inputClasses}
                            />
                            <Input
                                label="MONTO"
                                placeholder="0"
                                variant="bordered"
                                labelPlacement="outside"
                                type="number"
                                value={formData.amount?.toString() || ''}
                                onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-slate-400 text-small font-bold">$</span>
                                    </div>
                                }
                                isRequired
                                classNames={{
                                    ...inputClasses,
                                    input: "text-slate-800 font-bold"
                                }}
                            />
                        </div>

                        <Input
                            label="VENDEDOR"
                            placeholder="Nombre del vendedor"
                            variant="bordered"
                            labelPlacement="outside"
                            value={formData.seller}
                            onChange={(e) => handleInputChange('seller', e.target.value)}
                            isRequired
                            classNames={inputClasses}
                        />

                        <div className="flex flex-col gap-2 mt-2">
                            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">COMPROBANTE (ACTUALIZAR)</span>
                            <FileUpload
                                onFileSelect={setSelectedFile}
                                accept="image/*"
                                label="Seleccionar Imagen"
                                showPreview={true}
                            />
                            <small className="text-slate-400 text-xs">
                                Seleccione una nueva imagen solo si desea actualizar el comprobante actual
                            </small>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="bordered"
                        onPress={onHide}
                        isDisabled={isLoading}
                        className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-slate-800"
                        onPress={handleSubmit}
                        isLoading={isLoading}
                        isDisabled={isLoading}
                        startContent={!isLoading && <Check size={16} />}
                    >
                        Actualizar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

EditSaleModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    saleData: PropTypes.object,
    searchTerm: PropTypes.instanceOf(Date).isRequired
};

export default EditSaleModal;