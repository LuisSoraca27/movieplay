import React, { useState, useEffect } from 'react';
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Checkbox, Input, Chip, Divider
} from "@heroui/react";
import { Package, ShieldCheck, DollarSign, List, ArrowRight, CheckCircle, Tag } from 'lucide-react';

export default function PublishWizardModal({ isOpen, onClose, techAccount, onPublish, type }) {
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [prices, setPrices] = useState({});
    const [pins, setPins] = useState({});
    const [names, setNames] = useState({});
    const [sellType, setSellType] = useState('profile');
    const [step, setStep] = useState(1); // 1: config, 2: confirm
    const [loading, setLoading] = useState(false);

    const profileFields = ['profile1', 'profile2', 'profile3', 'profile4', 'profile5'];
    const activeProfiles = profileFields.filter(f => techAccount?.[f]);

    useEffect(() => {
        if (techAccount) {
            const initialPins = {};
            const initialNames = {};
            activeProfiles.forEach(f => {
                initialPins[f] = techAccount.pin || '';
                initialNames[f] = techAccount[f] || '';
            });
            setPins(initialPins);
            setNames(initialNames);
            setSelectedProfiles(activeProfiles);
            setStep(1);
            setPrices({});
            setLoading(false);
        }
    }, [techAccount]);

    const handlePublish = async () => {
        setLoading(true);
        try {
            await onPublish({
                id: techAccount.id,
                type,
                sellType,
                prices,
                pins,
                names,
                profilesToSell: selectedProfiles
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const canProceed = sellType === 'profile'
        ? selectedProfiles.length > 0 && selectedProfiles.every(f => prices[f] && parseInt(prices[f], 10) > 0)
        : prices.full && parseInt(prices.full, 10) > 0;

    const inputClasses = {
        label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
        input: "text-slate-700 font-semibold",
        inputWrapper: "bg-white border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 shadow-sm",
    };

    const renderStep1 = () => (
        <div className="flex flex-col gap-6">
            {/* Resumen de cuenta origen */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cuenta origen</p>
                <p className="text-lg font-bold text-slate-800">{techAccount?.email}</p>
                <div className="flex gap-4 mt-2 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Tag size={12} /> {techAccount?.supplier || 'N/A'}</span>
                    <span>•</span>
                    <span>{techAccount?.service_days || 'N/A'} días</span>
                    {techAccount?.cost > 0 && (
                        <>
                            <span>•</span>
                            <span>Costo: ${techAccount.cost}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Tipo de venta */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <Button
                    className={`flex-1 font-bold ${sellType === 'profile' ? 'bg-white shadow-sm text-slate-900' : 'bg-transparent text-slate-500'}`}
                    size="sm"
                    disableRipple
                    onPress={() => setSellType('profile')}
                >
                    POR PERFILES
                </Button>
                <Button
                    className={`flex-1 font-bold ${sellType === 'full' ? 'bg-white shadow-sm text-slate-900' : 'bg-transparent text-slate-500'}`}
                    size="sm"
                    disableRipple
                    onPress={() => setSellType('full')}
                >
                    CUENTA COMPLETA
                </Button>
            </div>

            {sellType === 'profile' ? (
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <List size={14} /> Selecciona perfiles a publicar
                    </h3>
                    {activeProfiles.length === 0 && (
                        <p className="text-sm font-medium text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                            Esta cuenta no tiene perfiles configurados. Agrégalos primero editando la cuenta.
                        </p>
                    )}
                    {activeProfiles.map((field, index) => (
                        <div key={field} className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all ${selectedProfiles.includes(field) ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-100 bg-white'}`}>
                            <div className="flex justify-between items-center">
                                <Checkbox
                                    isSelected={selectedProfiles.includes(field)}
                                    onValueChange={(val) => {
                                        if (val) setSelectedProfiles([...selectedProfiles, field]);
                                        else setSelectedProfiles(selectedProfiles.filter(p => p !== field));
                                    }}
                                    color="secondary"
                                    classNames={{ label: "font-semibold text-slate-700" }}
                                >
                                    {techAccount[field]}
                                </Checkbox>
                                <Chip size="sm" variant="flat" className="bg-white border border-slate-200 font-bold text-slate-500">P{index + 1}</Chip>
                            </div>
                            {selectedProfiles.includes(field) && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1 animate-fade-in">
                                    <Input
                                        size="sm"
                                        label="NOMBRE COMERCIAL"
                                        placeholder="Nombre"
                                        value={names[field] || ''}
                                        onValueChange={(val) => setNames({ ...names, [field]: val })}
                                        variant="bordered"
                                        labelPlacement="outside"
                                        classNames={inputClasses}
                                    />
                                    <Input
                                        size="sm"
                                        label="PRECIO"
                                        placeholder="0"
                                        type="number"
                                        startContent={<DollarSign size={12} className="text-slate-400" />}
                                        value={prices[field] || ''}
                                        onValueChange={(val) => setPrices({ ...prices, [field]: val })}
                                        variant="bordered"
                                        labelPlacement="outside"
                                        isRequired
                                        classNames={inputClasses}
                                    />
                                    <Input
                                        size="sm"
                                        label="PIN ACCESO"
                                        placeholder="1234"
                                        startContent={<ShieldCheck size={12} className="text-slate-400" />}
                                        value={pins[field] || ''}
                                        onValueChange={(val) => setPins({ ...pins, [field]: val })}
                                        variant="bordered"
                                        labelPlacement="outside"
                                        classNames={inputClasses}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-5 p-5 border border-slate-100 rounded-[2rem] bg-white shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configuración de Venta</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="NOMBRE COMERCIAL"
                            placeholder="Ej: Netflix Premium 30 días"
                            value={names.full || ''}
                            onValueChange={(val) => setNames({ ...names, full: val })}
                            variant="bordered"
                            labelPlacement="outside"
                            classNames={inputClasses}
                        />
                        <Input
                            label="PRECIO DE VENTA"
                            placeholder="0"
                            type="number"
                            startContent={<DollarSign size={14} className="text-slate-400" />}
                            value={prices.full || ''}
                            onValueChange={(val) => setPrices({ ...prices, full: val })}
                            variant="bordered"
                            labelPlacement="outside"
                            isRequired
                            classNames={inputClasses}
                        />
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 bg-slate-50 p-2 rounded-lg text-center">
                        Se publicará con las credenciales actuales de la cuenta maestra.
                    </p>
                </div>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <CheckCircle size={24} />
                <div>
                    <h3 className="font-bold text-sm">Todo listo para publicar</h3>
                    <p className="text-xs text-emerald-800 opacity-80">Revisa los precios antes de confirmar</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-10" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Resumen de Publicación</p>

                {sellType === 'profile' ? (
                    <div className="flex flex-col gap-3">
                        {selectedProfiles.map((field, i) => (
                            <div key={field} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-700">{names[field] || techAccount[field]}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PIN: {pins[field] || 'N/A'}</span>
                                </div>
                                <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs">
                                    ${prices[field] || 0}
                                </span>
                            </div>
                        ))}
                        <Divider className="my-2" />
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Estimado</span>
                            <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                                ${selectedProfiles.reduce((sum, f) => sum + (parseInt(prices[f], 10) || 0), 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700">{names.full || techAccount?.email}</span>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm">
                            ${Number(prices.full || 0).toLocaleString()}
                        </span>
                    </div>
                )}

                {techAccount?.cost > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            <span>Costo proveedor</span>
                            <span>${Number(techAccount.cost).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-indigo-600 mt-2 bg-indigo-50 p-2 rounded-lg">
                            <span>MARGEN ESTIMADO</span>
                            <span>
                                ${(sellType === 'profile'
                                    ? selectedProfiles.reduce((sum, f) => sum + (parseInt(prices[f], 10) || 0), 0) - techAccount.cost
                                    : (parseInt(prices.full, 10) || 0) - techAccount.cost
                                ).toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider">
                Los productos aparecerán en el stock de venta inmediatamente.
            </p>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
            classNames={{
                base: "rounded-[2rem] border border-slate-100 shadow-2xl bg-white",
                header: "border-b border-slate-100 py-6 px-8",
                footer: "border-t border-slate-100 py-6 px-8",
                closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
            }}
        >
            <ModalContent>
                <ModalHeader className="py-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                            {step === 1 ? 'Publicar Stock' : 'Confirmar Publicación'}
                        </h2>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                            {step === 1 ? 'CONFIGURA LOS PRECIOS Y DETALLES DE VENTA' : 'VERIFICA LA INFORMACIÓN ANTES DE GUARDAR'}
                        </span>
                    </div>
                </ModalHeader>
                <ModalBody className="py-6 px-8">
                    {step === 1 ? renderStep1() : renderStep2()}
                </ModalBody>
                <ModalFooter>
                    {step === 2 && (
                        <Button
                            variant="light"
                            onPress={() => setStep(1)}
                            isDisabled={loading}
                            className="font-bold text-slate-500 uppercase tracking-widest text-[10px]"
                        >
                            Volver
                        </Button>
                    )}
                    <Button
                        variant="bordered"
                        onPress={onClose}
                        isDisabled={loading}
                        className="font-bold border-slate-200 text-slate-600 uppercase tracking-widest text-[10px]"
                    >
                        Cancelar
                    </Button>
                    {step === 1 ? (
                        <Button
                            className="bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg hover:bg-slate-800"
                            onPress={() => setStep(2)}
                            isDisabled={!canProceed}
                            endContent={<ArrowRight size={16} />}
                        >
                            Continuar
                        </Button>
                    ) : (
                        <Button
                            className="bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg hover:bg-emerald-700"
                            onPress={handlePublish}
                            isLoading={loading}
                            isDisabled={loading}
                            startContent={!loading && <CheckCircle size={16} />}
                        >
                            Publicar Stock
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
