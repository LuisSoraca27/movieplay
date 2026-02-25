import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyKiosk, createKiosk, updateKiosk, uploadKioskLogo, clearKioskErrors } from '../features/kiosk/kioskSlice';
import KioskMarkupConfig from '../Components/Kiosk/KioskMarkupConfig';
import { addToast } from "@heroui/toast";
import {
    Input,
    Textarea,
    Button,
    Card,
    CardBody,
    Divider,
    Chip,
    Spinner,
    Tabs,
    Tab
} from "@heroui/react";
import {
    Store,
    Globe,
    Phone,
    Palette,
    Save,
    AlertCircle,
    ExternalLink,
    CheckCircle2,
    Settings,
    Coins,
    Check,
    Upload,
    ImageIcon,
    Trash2
} from 'lucide-react';

const KioskSettings = () => {
    const dispatch = useDispatch();
    const { myKiosk, isLoading, error, successMessage } = useSelector((state) => state.kiosk);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        whatsappNumber: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e293b'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [logoPreview, setLogoPreview] = useState(null);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    useEffect(() => {
        dispatch(fetchMyKiosk());
    }, [dispatch]);

    useEffect(() => {
        if (myKiosk) {
            setFormData({
                name: myKiosk.name || '',
                slug: myKiosk.slug || '',
                description: myKiosk.description || '',
                whatsappNumber: myKiosk.whatsappNumber || '',
                primaryColor: myKiosk.primaryColor || '#3b82f6',
                secondaryColor: myKiosk.secondaryColor || '#1e293b'
            });
            setIsEditing(true);
            if (myKiosk.logoUrl) {
                setLogoPreview(myKiosk.logoUrl);
            }
        } else {
            setIsEditing(false);
        }
    }, [myKiosk]);

    useEffect(() => {
        if (successMessage) {
            addToast({
                title: 'Éxito',
                description: successMessage,
                color: 'success',
                timeout: 3000
            });
            setIsSaving(false);
            dispatch(fetchMyKiosk());
            dispatch(clearKioskErrors());
        }
        if (error && error !== 'Kiosco no encontrado') {
            addToast({
                title: 'Error',
                description: error,
                color: 'danger',
                timeout: 3000
            });
            setIsSaving(false);
            dispatch(clearKioskErrors());
        }
    }, [successMessage, error, dispatch]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            return addToast({ title: 'Error', description: "El nombre del kiosco es obligatorio", color: 'danger' });
        }

        if (!formData.slug.trim()) {
            return addToast({ title: 'Error', description: "La URL de tu tienda es obligatoria", color: 'danger' });
        }

        if (!formData.slug.match(/^[a-z0-9-]+$/)) {
            return addToast({ title: 'Error', description: "La URL solo puede contener letras minúsculas, números y guiones", color: 'danger' });
        }

        if (formData.slug.length < 3) {
            return addToast({ title: 'Error', description: "La URL debe tener al menos 3 caracteres", color: 'danger' });
        }

        setIsSaving(true);

        if (isEditing) {
            dispatch(updateKiosk(formData));
        } else {
            dispatch(createKiosk(formData));
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            return addToast({ title: 'Error', description: 'Solo se permiten archivos de imagen', color: 'danger' });
        }

        if (file.size > 5 * 1024 * 1024) {
            return addToast({ title: 'Error', description: 'El archivo no puede superar los 5MB', color: 'danger' });
        }

        setLogoPreview(URL.createObjectURL(file));
        setIsUploadingLogo(true);

        try {
            await dispatch(uploadKioskLogo(file)).unwrap();
            addToast({ title: 'Éxito', description: 'Logo actualizado correctamente', color: 'success' });
        } catch (err) {
            addToast({ title: 'Error', description: err || 'Error al subir el logo', color: 'danger' });
            if (myKiosk?.logoUrl) {
                setLogoPreview(myKiosk.logoUrl);
            } else {
                setLogoPreview(null);
            }
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const mainDomain = import.meta.env.VITE_MAIN_DOMAIN || 'tudominio.com';
    const publicLink = formData.slug ? `http://${formData.slug}.${mainDomain}` : null;
    const previewLink = formData.slug ? `/k/${formData.slug}` : null;

    if (isLoading && !myKiosk && !error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spinner size="lg" color="primary" label="Sincronizando configuración..." />
            </div>
        );
    }

    return (
        <div className="animate-fade-in relative overflow-hidden pt-4 md:pt-8 pb-12">

            {/* Background Accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 -left-24 w-[500px] h-[500px] bg-indigo-100/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-6 border-b border-slate-200">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="bg-white p-5 rounded-2xl shadow-lg ring-1 ring-slate-200">
                            <Store size={32} className="text-slate-800" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                {isEditing ? 'Configuración de Kiosco' : 'Crear tu Kiosco'}
                            </h1>
                            <p className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mt-1">
                                {isEditing
                                    ? 'Personaliza tu tienda pública y márgenes de ganancia'
                                    : 'Inicia tu propio negocio digital en pocos pasos'
                                }
                            </p>
                        </div>
                    </div>

                    {isEditing && myKiosk && previewLink && (
                        <Button
                            as="a"
                            href={previewLink}
                            target="_blank"
                            size="lg"
                            endContent={<ExternalLink size={16} />}
                            className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] px-8 h-12 rounded-xl shadow-md hover:bg-slate-800 transition-all hover:scale-105"
                        >
                            Ver mi tienda
                        </Button>
                    )}
                </section>

                {/* Creation Form */}
                {!isEditing ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8">
                            <Card className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                                <CardBody className="p-0">
                                    <div className="mb-10">
                                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Primeros Pasos</h2>
                                        <p className="text-slate-500 text-sm font-semibold">Configura la identidad de tu tienda online.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <Input
                                                label="NOMBRE DEL KIOSCO"
                                                labelPlacement="outside"
                                                placeholder="Ej: My Streaming Shop"
                                                value={formData.name}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                isRequired
                                                variant="underlined"
                                                classNames={{
                                                    label: "text-slate-400 font-bold tracking-wider text-[10px]",
                                                    input: "text-slate-800 font-semibold text-lg",
                                                    inputWrapper: "border-slate-200 h-14"
                                                }}
                                            />

                                            <div className="space-y-2">
                                                <Input
                                                    label="URL DE TU TIENDA"
                                                    labelPlacement="outside"
                                                    placeholder="mi-tienda"
                                                    value={formData.slug}
                                                    onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                                                    isRequired
                                                    variant="underlined"
                                                    classNames={{
                                                        label: "text-slate-400 font-bold tracking-wider text-[10px]",
                                                        input: "text-slate-800 font-semibold text-lg",
                                                        inputWrapper: "border-slate-200 h-14"
                                                    }}
                                                    endContent={
                                                        <span className="text-blue-500 font-bold text-sm">.{mainDomain}</span>
                                                    }
                                                />
                                                {formData.slug && (
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                                                        Accesible en: <span className="text-blue-600">{publicLink}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                color="success"
                                                size="lg"
                                                isLoading={isSaving}
                                                className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] px-10 h-12 rounded-xl shadow-md w-full md:w-auto"
                                            >
                                                {isSaving ? 'Creando...' : 'Activar mi Kiosco'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="lg:col-span-4">
                            <Card className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 shadow-sm">
                                <CardBody className="p-0">
                                    <div className="flex flex-col gap-4">
                                        <div className="p-3 bg-white w-fit rounded-xl shadow-sm border border-blue-200">
                                            <AlertCircle className="text-blue-600" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-extrabold text-blue-900 tracking-tight">¿Qué obtendrás?</h4>
                                            <p className="text-blue-800/70 text-sm mt-1 font-medium leading-relaxed">
                                                Al crear tu kiosco, tendrás una página pública profesional para tus clientes con:
                                            </p>
                                            <ul className="mt-4 space-y-3">
                                                {[
                                                    'Catálogo automatizado',
                                                    'Gestión de precios personalizada',
                                                    'Identidad visual propia',
                                                    'Recepción de pedidos vía WhatsApp'
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-sm text-blue-900 font-semibold">
                                                        <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                ) : (
                    /* Existing Kiosk with Premium Tabs */
                    <div className="space-y-8">
                        <Tabs
                            selectedKey={activeTab}
                            onSelectionChange={setActiveTab}
                            variant="light"
                            radius="full"
                            size="lg"
                            classNames={{
                                tabList: "gap-4 p-1.5 bg-slate-200/40 backdrop-blur-md rounded-2xl w-fit mx-auto border border-slate-200/60 shadow-inner-sm",
                                cursor: "bg-slate-900 shadow-xl border border-slate-800",
                                tab: "h-10 px-6 md:px-8",
                                tabContent: "font-bold uppercase text-[11px] tracking-[0.15em] group-data-[selected=true]:text-white text-slate-500 transition-colors duration-300"
                            }}
                        >
                            <Tab
                                key="general"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Settings size={16} />
                                        <span>Personalización</span>
                                    </div>
                                }
                            />
                            <Tab
                                key="pricing"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Coins size={16} />
                                        <span>Precios y Ganancia</span>
                                    </div>
                                }
                            />
                        </Tabs>

                        <div className="animate-fade-in">
                            {activeTab === 'general' ? (
                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                                    <div className="xl:col-span-8">
                                        <Card className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-sm">
                                            <CardBody className="p-0">
                                                <form onSubmit={handleSubmit} className="space-y-10">
                                                    {/* Logo Section */}
                                                    <div className="flex flex-col md:flex-row items-center gap-10 p-8 bg-slate-50/50 border border-slate-200 rounded-3xl">
                                                        <div className="relative group">
                                                            <div className={`w-36 h-36 rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden ${!logoPreview ? 'bg-gradient-to-br from-slate-200 to-slate-300' : ''}`}>
                                                                {logoPreview ? (
                                                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <ImageIcon size={48} className="text-slate-400" />
                                                                )}
                                                                {isUploadingLogo && (
                                                                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                                                                        <Spinner size="md" color="white" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <label className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-2xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                                                <Upload size={18} />
                                                                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
                                                            </label>
                                                        </div>
                                                        <div className="flex-1 text-center md:text-left space-y-2">
                                                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Logo de la Marca</h3>
                                                            <p className="text-slate-500 text-sm font-semibold max-w-xs">
                                                                Sube una imagen cuadrada (1:1) de alta calidad para tu tienda.
                                                            </p>
                                                            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
                                                                <Chip size="sm" variant="flat" className="bg-white text-slate-500 font-bold uppercase text-[9px] tracking-wider border border-slate-200">Formatos: PNG, JPG</Chip>
                                                                <Chip size="sm" variant="flat" className="bg-white text-slate-500 font-bold uppercase text-[9px] tracking-wider border border-slate-200">Máx: 5MB</Chip>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Fields Section */}
                                                    <div className="space-y-8">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                                            <Input
                                                                label="NOMBRE DE TU TIENDA"
                                                                labelPlacement="outside"
                                                                placeholder="Ej: Max Streaming"
                                                                value={formData.name}
                                                                onChange={(e) => handleChange('name', e.target.value)}
                                                                variant="underlined"
                                                                classNames={{
                                                                    label: "text-slate-400 font-bold tracking-wider text-[10px]",
                                                                    input: "text-slate-800 font-semibold text-lg",
                                                                    inputWrapper: "border-slate-200 h-14"
                                                                }}
                                                            />
                                                            <Input
                                                                label="URL PERSONALIZADA"
                                                                labelPlacement="outside"
                                                                placeholder="mi-tienda"
                                                                value={formData.slug}
                                                                onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                                                                variant="underlined"
                                                                endContent={<span className="text-blue-600 font-bold text-sm">.{mainDomain}</span>}
                                                                classNames={{
                                                                    label: "text-slate-400 font-bold tracking-wider text-[10px]",
                                                                    input: "text-slate-800 font-semibold text-lg uppercase",
                                                                    inputWrapper: "border-slate-200 h-14"
                                                                }}
                                                            />
                                                            <Input
                                                                label="WHATSAPP DE PEDIDOS"
                                                                labelPlacement="outside"
                                                                placeholder="573001234567"
                                                                value={formData.whatsappNumber}
                                                                onChange={(e) => handleChange('whatsappNumber', e.target.value.replace(/\D/g, ''))}
                                                                variant="underlined"
                                                                startContent={<span className="text-slate-400 font-bold text-sm">+</span>}
                                                                classNames={{
                                                                    label: "text-slate-400 font-bold tracking-wider text-[10px]",
                                                                    input: "text-slate-800 font-semibold text-lg",
                                                                    inputWrapper: "border-slate-200 h-14"
                                                                }}
                                                            />
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-slate-400 font-bold tracking-wider text-[10px] block">C. PRIMARIO</label>
                                                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14">
                                                                        <input type="color" value={formData.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} className="w-8 h-8 rounded-full border-none cursor-pointer" />
                                                                        <span className="text-xs font-bold text-slate-600 font-mono uppercase">{formData.primaryColor}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-slate-400 font-bold tracking-wider text-[10px] block">C. SECUNDARIO</label>
                                                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14">
                                                                        <input type="color" value={formData.secondaryColor} onChange={(e) => handleChange('secondaryColor', e.target.value)} className="w-8 h-8 rounded-full border-none cursor-pointer" />
                                                                        <span className="text-xs font-bold text-slate-600 font-mono uppercase">{formData.secondaryColor}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Textarea
                                                            label="DESCRIPCIÓN COMERCIAL"
                                                            labelPlacement="outside"
                                                            placeholder="Cuéntales a tus clientes qué ofreces..."
                                                            value={formData.description}
                                                            onChange={(e) => handleChange('description', e.target.value)}
                                                            variant="underlined"
                                                            classNames={{
                                                                label: "text-slate-400 font-bold tracking-wider text-[10px]",
                                                                input: "text-slate-800 font-semibold text-base leading-relaxed",
                                                                inputWrapper: "border-slate-200"
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="flex justify-end pt-6">
                                                        <Button
                                                            type="submit"
                                                            isLoading={isSaving || isLoading}
                                                            className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] px-12 h-14 rounded-2xl shadow-xl shadow-slate-900/10"
                                                            startContent={!isSaving && !isLoading && <Save size={18} />}
                                                        >
                                                            {isSaving || isLoading ? 'Guardando...' : 'Actualizar Kiosco'}
                                                        </Button>
                                                    </div>
                                                </form>
                                            </CardBody>
                                        </Card>
                                    </div>

                                    {/* Preview Card */}
                                    <div className="xl:col-span-4 space-y-6">
                                        <Card className="bg-white border border-slate-200 rounded-[2.5rem] p-2 shadow-sm sticky top-6">
                                            <div className="bg-slate-100/50 rounded-[2rem] overflow-hidden">
                                                <div
                                                    className="h-32 flex items-center justify-center relative backdrop-blur-sm shadow-inner"
                                                    style={{ background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})` }}
                                                >
                                                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-2xl relative z-10 overflow-hidden bg-white">
                                                        {logoPreview ? (
                                                            <img src={logoPreview} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-2xl uppercase">
                                                                {formData.name?.slice(0, 2)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-8 text-center space-y-4">
                                                    <div>
                                                        <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">{formData.name || 'Tu Tienda'}</h4>
                                                        <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">
                                                            {formData.slug ? `${formData.slug}.${mainDomain}` : 'url-tienda.com'}
                                                        </p>
                                                    </div>
                                                    <div className="py-4 border-y border-slate-200/50">
                                                        <p className="text-sm text-slate-500 font-medium italic line-clamp-3 leading-relaxed">
                                                            {formData.description || 'Sin descripción comercial definida.'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Check size={14} className="text-emerald-500" />
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Vista Previa del Header</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="bg-slate-900 border-none rounded-[2rem] p-8 shadow-2xl overflow-hidden relative group">
                                            <div className="absolute top-0 right-0 p-12 bg-blue-500/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-blue-500/20 transition-colors" />
                                            <div className="relative z-10 space-y-4">
                                                <Globe className="text-blue-400 mb-2" size={32} />
                                                <h4 className="text-white text-lg font-extrabold tracking-tight">Tu Negocio Digital</h4>
                                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                                    Comparte tu URL con tus clientes. Ellos verán tus productos con los precios que tú definas.
                                                </p>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <KioskMarkupConfig />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KioskSettings;
