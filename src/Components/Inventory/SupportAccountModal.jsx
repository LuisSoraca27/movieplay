import React, { useState, useEffect } from 'react';
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Select, SelectItem, Textarea, DatePicker
} from "@heroui/react";
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { optionsCategory } from '../../utils/functions/selectNameCategoryOptions';
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";
import { X, Check, Store, DollarSign, Mail, Lock, Key, Calendar, LifeBuoy } from 'lucide-react';

const SupportAccountModal = ({ visible, onHide, onSubmit, initialData }) => {
    const isEditMode = !!initialData;
    const [loading, setLoading] = useState(false);

    const statusOptions = [
        { label: 'Disponible', value: 'disponible' },
        { label: 'Ocupada', value: 'ocupada' },
        { label: 'Caída', value: 'caida' },
    ];

    const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        defaultValues: {
            observation: '',
            supplier: '',
            email: '',
            password: '',
            pin: '',
            profile1: '',
            profile2: '',
            profile3: '',
            profile4: '',
            profile5: '',
            cost: 0,
            creation_date: null,
            service_days: null,
            end_date: null,
            status: 'disponible',
            categoryId: null,
            account_status: '',
        }
    });

    const watchedCreationDate = watch('creation_date');
    const watchedServiceDays = watch('service_days');

    useEffect(() => {
        if (isEditMode && initialData) {
            Object.keys(initialData).forEach(key => {
                if ((key === 'creation_date' || key === 'end_date') && initialData[key]) {
                    setValue(key, new Date(initialData[key]));
                } else if (key === 'categoryId') {
                    // Ensure category match option values
                    setValue(key, String(initialData[key]));
                } else {
                    setValue(key, initialData[key]);
                }
            });
        } else {
            reset();
            setValue('creation_date', new Date());
            setValue('status', 'disponible');
        }
    }, [initialData, isEditMode, reset, setValue]);

    useEffect(() => {
        if (watchedCreationDate && watchedServiceDays) {
            const creationDate = new Date(watchedCreationDate);
            const serviceDays = parseInt(watchedServiceDays, 10);

            if (!isNaN(serviceDays) && serviceDays > 0) {
                const endDate = new Date(creationDate);
                endDate.setDate(endDate.getDate() + serviceDays);
                setValue('end_date', endDate);
            }
        }
    }, [watchedCreationDate, watchedServiceDays, setValue]);

    const getCalendarDate = (date) => {
        if (!date) return today(getLocalTimeZone());
        try {
            if (date instanceof Date) {
                return parseDate(date.toISOString().split('T')[0]);
            }
            return today(getLocalTimeZone());
        } catch (e) {
            return today(getLocalTimeZone());
        }
    };

    const handleFormSubmit = async (data) => {
        setLoading(true);
        try {
            const submissionData = {
                ...data,
                categoryId: data.categoryId ? parseInt(data.categoryId, 10) : null,
                service_days: data.service_days ? parseInt(data.service_days, 10) : null,
                cost: data.cost ? parseInt(data.cost, 10) : 0,
                // Ensure dates are strings for backend if needed, or Date objects depending on slice
                creation_date: data.creation_date instanceof Date ? data.creation_date.toISOString() : data.creation_date,
                end_date: data.end_date instanceof Date ? data.end_date.toISOString() : data.end_date,
            };
            await onSubmit(submissionData);
        } catch (error) {
            console.error('Error en submit soporte:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleHide = () => {
        reset();
        onHide();
        setLoading(false);
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
                base: "rounded-[2rem] border border-slate-100 shadow-2xl bg-white",
                header: "border-b border-slate-100 py-6 px-8",
                footer: "border-t border-slate-100 py-6 px-8",
                closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                        {isEditMode ? "EDITAR CUENTA DE SOPORTE" : "NUEVA CUENTA DE SOPORTE"}
                    </h2>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        {isEditMode ? "MODIFICAR DATOS DE REPUESTO" : "REGISTRAR CUENTA DE RESPALDO"}
                    </span>
                </ModalHeader>
                <ModalBody className="py-8 px-8">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Columna Izquierda */}
                        <div className="flex flex-col gap-5">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                                <LifeBuoy size={14} className="text-indigo-500" /> Origen
                            </h3>

                            <Controller
                                name="categoryId"
                                control={control}
                                rules={{ required: 'Categoría es requerida.' }}
                                render={({ field }) => (
                                    <Select
                                        label="CATEGORÍA"
                                        placeholder="Seleccione plataforma"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        selectedKeys={field.value ? [field.value] : []}
                                        onSelectionChange={(keys) => field.onChange([...keys][0])}
                                        isDisabled={isEditMode}
                                        isInvalid={!!errors.categoryId}
                                        errorMessage={errors.categoryId?.message}
                                        classNames={inputClasses}
                                    >
                                        {optionsCategory.map((opt) => (
                                            <SelectItem key={opt.code}>{opt.name}</SelectItem>
                                        ))}
                                    </Select>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="supplier"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="PROVEEDOR"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            placeholder="Nombre"
                                            classNames={inputClasses}
                                        />
                                    )}
                                />
                                <Controller
                                    name="cost"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="COSTO"
                                            type="number"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            placeholder="0.00"
                                            startContent={<DollarSign size={14} className="text-slate-400" />}
                                            classNames={inputClasses}
                                        />
                                    )}
                                />
                            </div>

                            <div className="my-2 border-t border-slate-100" />

                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Key size={14} className="text-indigo-500" /> Accesos
                            </h3>

                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: 'Email es requerido.',
                                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Email inválido" }
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="EMAIL DE ACCESO"
                                        type="email"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        placeholder="ejemplo@correo.com"
                                        startContent={<Mail size={16} className="text-slate-400" />}
                                        isInvalid={!!errors.email}
                                        errorMessage={errors.email?.message}
                                        classNames={inputClasses}
                                    />
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: 'Requerido.' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="CONTRASEÑA"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            placeholder="******"
                                            startContent={<Lock size={14} className="text-slate-400" />}
                                            isInvalid={!!errors.password}
                                            errorMessage={errors.password?.message}
                                            classNames={inputClasses}
                                        />
                                    )}
                                />
                                <Controller
                                    name="pin"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="PIN"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            placeholder="1234"
                                            classNames={inputClasses}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="flex flex-col gap-5">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Calendar size={14} className="text-indigo-500" /> Tiempos
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="creation_date"
                                    control={control}
                                    rules={{ required: 'Requerido.' }}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="FECHA ENTREGA" // Different label than admin
                                            value={getCalendarDate(field.value)}
                                            onChange={(date) => {
                                                if (date) {
                                                    const jsDate = new Date(date.year, date.month - 1, date.day);
                                                    field.onChange(jsDate);
                                                }
                                            }}
                                            variant="bordered"
                                            labelPlacement="outside"
                                            isInvalid={!!errors.creation_date}
                                            errorMessage={errors.creation_date?.message}
                                            classNames={inputClasses}
                                        />
                                    )}
                                />

                                <Controller
                                    name="service_days"
                                    control={control}
                                    rules={{ required: 'Requerido.' }}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            label="DÍAS SERVICIO"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            placeholder="30"
                                            value={field.value?.toString() || ''}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            min={0}
                                            isInvalid={!!errors.service_days}
                                            errorMessage={errors.service_days?.message}
                                            classNames={inputClasses}
                                        />
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="end_date"
                                    control={control}
                                    rules={{ required: 'Requerido.' }}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="FECHA FINAL"
                                            value={getCalendarDate(field.value)}
                                            onChange={(date) => {
                                                if (date) {
                                                    const jsDate = new Date(date.year, date.month - 1, date.day);
                                                    field.onChange(jsDate);
                                                }
                                            }}
                                            variant="bordered"
                                            labelPlacement="outside"
                                            isInvalid={!!errors.end_date}
                                            errorMessage={errors.end_date?.message}
                                            classNames={inputClasses}
                                        />
                                    )}
                                />

                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: 'Requerido.' }}
                                    render={({ field }) => (
                                        <Select
                                            label="ESTADO"
                                            placeholder="Seleccione"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            selectedKeys={field.value ? [field.value] : []}
                                            onSelectionChange={(keys) => field.onChange([...keys][0])}
                                            isInvalid={!!errors.status}
                                            errorMessage={errors.status?.message}
                                            classNames={inputClasses}
                                        >
                                            {statusOptions.map((opt) => (
                                                <SelectItem key={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="my-2 border-t border-slate-100" />

                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{`Perfiles & Extras`}</h3>

                            {/* Support accounts might have profiles too but usually less structured or same structure */}
                            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <Controller
                                        key={`profile${num}`}
                                        name={`profile${num}`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label={`PERFIL ${num}`}
                                                size="sm"
                                                variant="underlined"
                                                labelPlacement="outside"
                                                placeholder={`Nombre`}
                                                classNames={{
                                                    ...inputClasses,
                                                    inputWrapper: "bg-transparent border-b border-slate-200 shadow-none px-0"
                                                }}
                                            />
                                        )}
                                    />
                                ))}
                            </div>

                            <Controller
                                name="observation"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        label="OBSERVACIÓN TÉCNICA"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        placeholder="Motivo de soporte..."
                                        minRows={2}
                                        classNames={inputClasses}
                                    />
                                )}
                            />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="bordered"
                        onPress={handleHide}
                        isDisabled={loading}
                        className="font-bold border-slate-200 text-slate-600 uppercase tracking-widest text-[10px]"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg hover:bg-slate-800"
                        onPress={handleSubmit(handleFormSubmit)}
                        isLoading={loading}
                        isDisabled={loading}
                        startContent={!loading && <Check size={16} />}
                    >
                        {isEditMode ? "Guardar Cambios" : "Crear Soporte"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

SupportAccountModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
};

export default SupportAccountModal;