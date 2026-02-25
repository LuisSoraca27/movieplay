import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchStoreSettings,
    updateStoreSettings,
    uploadStoreLogo,
    deleteStoreLogo,
    clearStoreSettingsErrors
} from '../features/storeSettings/storeSettingsSlice';
import { addToast } from "@heroui/toast";
import {
    Input,
    Textarea,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Spinner,
    Tabs,
    Tab,
    Switch,
    Image,
    Chip,
    Alert
} from "@heroui/react";
import {
    Store,
    Globe,
    Phone,
    Save,
    Settings,
    Clock,
    Mail,
    MessageSquare,
    Share2,
    Upload,
    Trash2,
    AlertTriangle,
    CreditCard,
    FileText,
    Megaphone,
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    Send,
    CheckCircle2
} from 'lucide-react';
import { PageContainer, PremiumHeader, PremiumCard } from '../Components/ui/PremiumComponents';

// Días de la semana en español
const DAYS_OF_WEEK = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
};

// Estilos reutilizables para inputs
const inputStyles = {
    label: "text-slate-400 font-bold tracking-wider text-[10px]",
    input: "text-slate-800 font-semibold text-lg",
    inputWrapper: "border-slate-200 h-14 group-data-[focus=true]:border-slate-900",
    mainWrapper: "h-full"
};

const textAreaStyles = {
    label: "text-slate-400 font-bold tracking-wider text-[10px]",
    input: "text-slate-800 font-semibold text-lg",
    inputWrapper: "border-slate-200 group-data-[focus=true]:border-slate-900"
};

const StoreSettings = () => {
    const dispatch = useDispatch();
    const { settings, isLoading, isSaving, error, successMessage } = useSelector((state) => state.storeSettings);
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        storeName: '',
        storeDescription: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        socialLinks: {
            whatsappVentas1: '',
            whatsappVentas2: '',
            whatsappSoporte: '',
            telegram: '',
            instagram: '',
            facebook: '',
            twitter: '',
            tiktok: '',
            youtube: ''
        },
        businessHours: {
            monday: { open: '09:00', close: '18:00', isOpen: true },
            tuesday: { open: '09:00', close: '18:00', isOpen: true },
            wednesday: { open: '09:00', close: '18:00', isOpen: true },
            thursday: { open: '09:00', close: '18:00', isOpen: true },
            friday: { open: '09:00', close: '18:00', isOpen: true },
            saturday: { open: '09:00', close: '14:00', isOpen: true },
            sunday: { open: '00:00', close: '00:00', isOpen: false }
        },
        timezone: 'America/Bogota',
        welcomeMessage: '',
        footerMessage: '',
        termsAndConditions: '',
        privacyPolicy: '',
        paymentMethods: {
            nequi: { enabled: true, number: '' },
            daviplata: { enabled: true, number: '' },
            bancolombia: { enabled: true, account: '' },
            paypal: { enabled: false, email: '' },
            wompi: { enabled: false }
        },
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        maintenanceMode: false,
        maintenanceMessage: '',
        showPromoBanner: false,
        promoBannerText: '',
        promoBannerLink: ''
    });

    useEffect(() => {
        dispatch(fetchStoreSettings());
    }, [dispatch]);

    useEffect(() => {
        if (settings) {
            setFormData({
                storeName: settings.storeName || '',
                storeDescription: settings.storeDescription || '',
                contactEmail: settings.contactEmail || '',
                contactPhone: settings.contactPhone || '',
                address: settings.address || '',
                socialLinks: settings.socialLinks || formData.socialLinks,
                businessHours: settings.businessHours || formData.businessHours,
                timezone: settings.timezone || 'America/Bogota',
                welcomeMessage: settings.welcomeMessage || '',
                footerMessage: settings.footerMessage || '',
                termsAndConditions: settings.termsAndConditions || '',
                privacyPolicy: settings.privacyPolicy || '',
                paymentMethods: settings.paymentMethods || formData.paymentMethods,
                seoTitle: settings.seoTitle || '',
                seoDescription: settings.seoDescription || '',
                seoKeywords: settings.seoKeywords || '',
                maintenanceMode: settings.maintenanceMode || false,
                maintenanceMessage: settings.maintenanceMessage || '',
                showPromoBanner: settings.showPromoBanner || false,
                promoBannerText: settings.promoBannerText || '',
                promoBannerLink: settings.promoBannerLink || ''
            });
        }
    }, [settings]);

    // Feedback: toast + banner. Limpiar estado después de un momento para que el usuario vea el mensaje.
    useEffect(() => {
        if (successMessage) {
            addToast({
                title: 'Guardado',
                description: successMessage,
                color: 'success',
                timeout: 4000
            });
            const t = setTimeout(() => dispatch(clearStoreSettingsErrors()), 5000);
            return () => clearTimeout(t);
        }
        if (error) {
            addToast({
                title: 'Error',
                description: typeof error === 'string' ? error : 'Error al guardar. Revisa la conexión o intenta de nuevo.',
                color: 'danger',
                timeout: 6000
            });
            const t = setTimeout(() => dispatch(clearStoreSettingsErrors()), 7000);
            return () => clearTimeout(t);
        }
    }, [successMessage, error, dispatch]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    const handleBusinessHoursChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            businessHours: {
                ...prev.businessHours,
                [day]: {
                    ...prev.businessHours[day],
                    [field]: value
                }
            }
        }));
    };

    const handlePaymentMethodChange = (method, field, value) => {
        setFormData(prev => ({
            ...prev,
            paymentMethods: {
                ...prev.paymentMethods,
                [method]: {
                    ...prev.paymentMethods[method],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = (e) => {
        // El botón usa onPress (HeroUI): el evento no es un submit, puede no tener preventDefault
        if (e?.preventDefault) e.preventDefault();
        dispatch(updateStoreSettings(formData));
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                addToast({
                    title: 'Error',
                    description: 'El archivo no debe superar los 5MB',
                    color: 'danger'
                });
                e.target.value = '';
                return;
            }
            dispatch(uploadStoreLogo(file));
        }
        e.target.value = '';
    };

    const handleDeleteLogo = () => {
        dispatch(deleteStoreLogo());
    };

    if (isLoading && !settings) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Spinner size="lg" color="primary" />
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Cargando configuración...</p>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* ToastContainer removed as it is handled globally */}

            {/* Banner de feedback (éxito / error) */}
            {(successMessage || error) && (
                <Alert
                    className="mb-6 z-10"
                    color={successMessage ? 'success' : 'danger'}
                    title={successMessage ? 'Guardado correctamente' : 'Error al guardar'}
                    description={successMessage || error}
                    startContent={successMessage ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
                    endContent={
                        <Button
                            size="sm"
                            variant="light"
                            onPress={() => dispatch(clearStoreSettingsErrors())}
                        >
                            Cerrar
                        </Button>
                    }
                />
            )}

            <PremiumHeader
                title="Configuración de la Tienda"
                description="Personaliza la apariencia y configuración general de tu tienda"
                icon={Settings}
                action={
                    <Button
                        className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] h-12 px-8 rounded-xl shadow-lg hover:bg-slate-800 hover:scale-105 transition-all"
                        startContent={!isSaving && <Save size={18} />}
                        isLoading={isSaving}
                        onPress={handleSubmit}
                    >
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                }
            />

            <PremiumCard>
                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={setActiveTab}
                    radius="full"
                    variant="light"
                    classNames={{
                        base: "w-full overflow-x-auto mb-10",
                        tabList: "gap-4 p-1.5 bg-slate-200/40 backdrop-blur-md rounded-2xl w-fit mx-auto border border-slate-200/60 shadow-inner-sm",
                        cursor: "bg-slate-900 shadow-xl border border-slate-800",
                        tab: "h-10 px-6 min-w-max",
                        tabContent: "font-bold uppercase text-[11px] tracking-[0.15em] group-data-[selected=true]:text-white text-slate-500 transition-colors"
                    }}
                >
                    {/* Tab 1: Información General */}
                    <Tab
                        key="general"
                        title={
                            <div className="flex items-center space-x-2">
                                <Store size={18} />
                                <span>General</span>
                            </div>
                        }
                    >
                        <div className="py-8 grid gap-10 lg:grid-cols-2">
                            {/* Logo */}
                            <div className="bg-slate-50/80 rounded-[2rem] p-8 border border-slate-100">
                                <div className="mb-6">
                                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Logo de la Tienda</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Imagen que representa tu negocio</p>
                                </div>
                                <div className="flex flex-col items-center gap-6">
                                    {settings?.logoUrl ? (
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                            <Image
                                                src={settings.logoUrl}
                                                alt="Logo"
                                                className="w-40 h-40 object-contain rounded-xl bg-white relative z-10"
                                            />
                                            <Button
                                                isIconOnly
                                                color="danger"
                                                variant="shadow"
                                                size="sm"
                                                className="absolute -top-2 -right-2 z-20"
                                                onPress={handleDeleteLogo}
                                                isLoading={isSaving}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="w-40 h-40 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-white">
                                            <Store size={48} className="text-slate-300" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleLogoUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <div className="text-center space-y-2">
                                        <Button
                                            className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] h-10 px-6 rounded-lg shadow-md hover:bg-slate-800 transition-all"
                                            startContent={<Upload size={16} />}
                                            onPress={() => fileInputRef.current?.click()}
                                            isLoading={isSaving}
                                        >
                                            {settings?.logoUrl ? 'Cambiar Logo' : 'Subir Logo'}
                                        </Button>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">PNG, JPG o WebP. Máximo 5MB.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Información Básica */}
                            <div className="space-y-8">
                                <div className="mb-2">
                                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Información Básica</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Datos principales de tu tienda</p>
                                </div>
                                <div className="space-y-6">
                                    <Input
                                        label="NOMBRE DE LA TIENDA"
                                        placeholder="Mi Tienda de Streaming"
                                        value={formData.storeName}
                                        onChange={(e) => handleChange('storeName', e.target.value)}
                                        variant="underlined"
                                        labelPlacement="outside"
                                        classNames={inputStyles}
                                    />
                                    <Textarea
                                        label="DESCRIPCIÓN"
                                        placeholder="Describe brevemente tu negocio..."
                                        value={formData.storeDescription}
                                        onChange={(e) => handleChange('storeDescription', e.target.value)}
                                        variant="underlined"
                                        labelPlacement="outside"
                                        minRows={3}
                                        classNames={textAreaStyles}
                                    />
                                    <Input
                                        label="MENSAJE DE BIENVENIDA"
                                        placeholder="¡Bienvenido a nuestra tienda!"
                                        value={formData.welcomeMessage}
                                        onChange={(e) => handleChange('welcomeMessage', e.target.value)}
                                        variant="underlined"
                                        labelPlacement="outside"
                                        classNames={inputStyles}
                                    />
                                </div>
                            </div>

                            {/* Contacto */}
                            <div className="lg:col-span-2 pt-8 border-t border-slate-100">
                                <div className="mb-8">
                                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Información de Contacto</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Cómo pueden contactarte tus clientes</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-10">
                                    <Input
                                        label="CORREO ELECTRÓNICO"
                                        placeholder="contacto@tienda.com"
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                                        variant="underlined"
                                        labelPlacement="outside"
                                        classNames={inputStyles}
                                    />
                                    <Input
                                        label="TELÉFONO"
                                        placeholder="+57 300 123 4567"
                                        value={formData.contactPhone}
                                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                                        variant="underlined"
                                        labelPlacement="outside"
                                        classNames={inputStyles}
                                    />
                                    <div className="md:col-span-2">
                                        <Textarea
                                            label="DIRECCIÓN FÍSICA"
                                            placeholder="Ciudad, País"
                                            value={formData.address}
                                            onChange={(e) => handleChange('address', e.target.value)}
                                            variant="underlined"
                                            labelPlacement="outside"
                                            classNames={textAreaStyles}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>

                    {/* Tab 2: Redes Sociales */}
                    <Tab
                        key="social"
                        title={
                            <div className="flex items-center space-x-2">
                                <Share2 size={18} />
                                <span>Redes Sociales</span>
                            </div>
                        }
                    >
                        <div className="py-8 max-w-4xl mx-auto">
                            <div className="mb-8 text-center">
                                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Redes Sociales</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Conecta con tu audiencia</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <Input
                                    label="WHATSAPP VENTAS 1"
                                    placeholder="573001234567"
                                    value={formData.socialLinks.whatsappVentas1}
                                    onChange={(e) => handleNestedChange('socialLinks', 'whatsappVentas1', e.target.value)}
                                    variant="underlined"
                                    labelPlacement="outside"
                                    startContent={<Phone size={18} className="text-green-500" />}
                                    description="Número principal de ventas (con código de país)"
                                    classNames={inputStyles}
                                />
                                <Input
                                    label="WHATSAPP VENTAS 2"
                                    placeholder="573001234567"
                                    value={formData.socialLinks.whatsappVentas2}
                                    onChange={(e) => handleNestedChange('socialLinks', 'whatsappVentas2', e.target.value)}
                                    variant="underlined"
                                    labelPlacement="outside"
                                    startContent={<Phone size={18} className="text-green-500" />}
                                    description="Segundo número de ventas (opcional)"
                                    classNames={inputStyles}
                                />
                                <Input
                                    label="WHATSAPP SOPORTE"
                                    placeholder="573001234567"
                                    value={formData.socialLinks.whatsappSoporte}
                                    onChange={(e) => handleNestedChange('socialLinks', 'whatsappSoporte', e.target.value)}
                                    variant="underlined"
                                    labelPlacement="outside"
                                    startContent={<Phone size={18} className="text-blue-500" />}
                                    description="Número de soporte técnico (opcional)"
                                    classNames={inputStyles}
                                />
                                <Input
                                    label="TELEGRAM"
                                    placeholder="@usuario"
                                    value={formData.socialLinks.telegram}
                                    onChange={(e) => handleNestedChange('socialLinks', 'telegram', e.target.value)}
                                    variant="underlined"
                                    labelPlacement="outside"
                                    startContent={<Send size={18} className="text-blue-500" />}
                                    classNames={inputStyles}
                                />
                                <Input
                                    label="INSTAGRAM"
                                    placeholder="https://instagram.com/usuario"
                                    value={formData.socialLinks.instagram}
                                    onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                                    variant="underlined"
                                    labelPlacement="outside"
                                    startContent={<Instagram size={18} className="text-pink-500" />}
                                    classNames={inputStyles}
                                />
                                <Input
                                    label="FACEBOOK"
                                    placeholder="https://facebook.com/pagina"
                                    value={formData.socialLinks.facebook}
                                    onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                                    variant="underlined"
                                    labelPlacement="outside"
                                    startContent={<Facebook size={18} className="text-blue-600" />}
                                    classNames={inputStyles}
                                />
                                <Input
                                    label="TWITTER / X"
                                    placeholder="https://twitter.com/usuario"
                                    value={formData.socialLinks.twitter}
                                    onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                                    variant="underlined"
                                    labelPlacement="outside"
                                    startContent={<Twitter size={18} className="text-sky-500" />}
                                    classNames={inputStyles}
                                />
                                <Input
                                    label="TIKTOK"
                                    placeholder="https://tiktok.com/@usuario"
                                    value={formData.socialLinks.tiktok}
                                    onChange={(e) => handleNestedChange('socialLinks', 'tiktok', e.target.value)}
                                    variant="underlined"
                                    labelPlacement="outside"
                                    startContent={
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-slate-900">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.79a4.84 4.84 0 0 1-1-.1z" />
                                        </svg>
                                    }
                                    classNames={inputStyles}
                                />
                                <Input
                                    label="YOUTUBE"
                                    placeholder="https://youtube.com/@canal"
                                    value={formData.socialLinks.youtube}
                                    onChange={(e) => handleNestedChange('socialLinks', 'youtube', e.target.value)}
                                    variant="underlined"
                                    labelPlacement="outside"
                                    startContent={<Youtube size={18} className="text-red-500" />}
                                    classNames={inputStyles}
                                />
                            </div>
                        </div>
                    </Tab>

                    {/* Tab 3: Horario de Atención */}
                    <Tab
                        key="hours"
                        title={
                            <div className="flex items-center space-x-2">
                                <Clock size={18} />
                                <span>Horarios</span>
                            </div>
                        }
                    >
                        <div className="py-8 max-w-3xl mx-auto">
                            <div className="mb-8 text-center">
                                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Horario de Atención</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Configura tus horarios de trabajo</p>
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-2">
                                {Object.entries(DAYS_OF_WEEK).map(([key, label]) => (
                                    <div key={key} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4 w-40">
                                            <Switch
                                                isSelected={formData.businessHours[key]?.isOpen}
                                                onValueChange={(val) => handleBusinessHoursChange(key, 'isOpen', val)}
                                                color="secondary"
                                                classNames={{
                                                    wrapper: "group-data-[selected=true]:bg-slate-900"
                                                }}
                                            />
                                            <span className={`font-bold text-sm ${formData.businessHours[key]?.isOpen ? 'text-slate-700' : 'text-slate-400'}`}>
                                                {label}
                                            </span>
                                        </div>

                                        {formData.businessHours[key]?.isOpen ? (
                                            <div className="flex items-center gap-4 flex-1 justify-end">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="time"
                                                        value={formData.businessHours[key]?.open || '09:00'}
                                                        onChange={(e) => handleBusinessHoursChange(key, 'open', e.target.value)}
                                                        variant="underlined"
                                                        size="sm"
                                                        className="w-28"
                                                        classNames={{
                                                            input: "font-bold text-slate-700 text-center",
                                                            inputWrapper: "h-10 border-slate-200"
                                                        }}
                                                    />
                                                    <span className="text-slate-300 font-bold text-xs">A</span>
                                                    <Input
                                                        type="time"
                                                        value={formData.businessHours[key]?.close || '18:00'}
                                                        onChange={(e) => handleBusinessHoursChange(key, 'close', e.target.value)}
                                                        variant="underlined"
                                                        size="sm"
                                                        className="w-28"
                                                        classNames={{
                                                            input: "font-bold text-slate-700 text-center",
                                                            inputWrapper: "h-10 border-slate-200"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 text-right">
                                                <Chip className="bg-slate-100 text-slate-400 font-bold border-none" size="sm">CERRADO</Chip>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Tab>

                    {/* Tab 4: Métodos de Pago */}
                    <Tab
                        key="payments"
                        title={
                            <div className="flex items-center space-x-2">
                                <CreditCard size={18} />
                                <span>Pagos</span>
                            </div>
                        }
                    >
                        <div className="py-8 max-w-4xl mx-auto">
                            <div className="mb-8 text-center">
                                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Métodos de Pago</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Configura cómo pueden pagarte tus clientes</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Nequi */}
                                <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${formData.paymentMethods.nequi?.enabled ? 'bg-white border-pink-200 shadow-lg shadow-pink-100/50' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-pink-500/20">N</div>
                                            <span className="font-bold text-slate-800 text-lg">Nequi</span>
                                        </div>
                                        <Switch
                                            isSelected={formData.paymentMethods.nequi?.enabled}
                                            onValueChange={(val) => handlePaymentMethodChange('nequi', 'enabled', val)}
                                            classNames={{
                                                wrapper: "group-data-[selected=true]:bg-pink-500"
                                            }}
                                        />
                                    </div>
                                    <div className={`transition-all duration-300 ${formData.paymentMethods.nequi?.enabled ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                        <Input
                                            label="NÚMERO DE TÉLEFONO"
                                            placeholder="3001234567"
                                            value={formData.paymentMethods.nequi?.number || ''}
                                            onChange={(e) => handlePaymentMethodChange('nequi', 'number', e.target.value)}
                                            variant="underlined"
                                            classNames={inputStyles}
                                        />
                                    </div>
                                </div>

                                {/* Daviplata */}
                                <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${formData.paymentMethods.daviplata?.enabled ? 'bg-white border-red-200 shadow-lg shadow-red-100/50' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-red-500/20">D</div>
                                            <span className="font-bold text-slate-800 text-lg">Daviplata</span>
                                        </div>
                                        <Switch
                                            isSelected={formData.paymentMethods.daviplata?.enabled}
                                            onValueChange={(val) => handlePaymentMethodChange('daviplata', 'enabled', val)}
                                            classNames={{
                                                wrapper: "group-data-[selected=true]:bg-red-500"
                                            }}
                                        />
                                    </div>
                                    <div className={`transition-all duration-300 ${formData.paymentMethods.daviplata?.enabled ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                        <Input
                                            label="NÚMERO DE TÉLEFONO"
                                            placeholder="3001234567"
                                            value={formData.paymentMethods.daviplata?.number || ''}
                                            onChange={(e) => handlePaymentMethodChange('daviplata', 'number', e.target.value)}
                                            variant="underlined"
                                            classNames={inputStyles}
                                        />
                                    </div>
                                </div>

                                {/* Bancolombia */}
                                <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${formData.paymentMethods.bancolombia?.enabled ? 'bg-white border-yellow-200 shadow-lg shadow-yellow-100/50' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-yellow-400/20">B</div>
                                            <span className="font-bold text-slate-800 text-lg">Bancolombia</span>
                                        </div>
                                        <Switch
                                            isSelected={formData.paymentMethods.bancolombia?.enabled}
                                            onValueChange={(val) => handlePaymentMethodChange('bancolombia', 'enabled', val)}
                                            classNames={{
                                                wrapper: "group-data-[selected=true]:bg-yellow-400"
                                            }}
                                        />
                                    </div>
                                    <div className={`transition-all duration-300 ${formData.paymentMethods.bancolombia?.enabled ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                        <Input
                                            label="NÚMERO DE CUENTA"
                                            placeholder="1234567890"
                                            value={formData.paymentMethods.bancolombia?.account || ''}
                                            onChange={(e) => handlePaymentMethodChange('bancolombia', 'account', e.target.value)}
                                            variant="underlined"
                                            classNames={inputStyles}
                                        />
                                    </div>
                                </div>

                                {/* PayPal */}
                                <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${formData.paymentMethods.paypal?.enabled ? 'bg-white border-blue-200 shadow-lg shadow-blue-100/50' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#0070BA] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">P</div>
                                            <span className="font-bold text-slate-800 text-lg">PayPal</span>
                                        </div>
                                        <Switch
                                            isSelected={formData.paymentMethods.paypal?.enabled}
                                            onValueChange={(val) => handlePaymentMethodChange('paypal', 'enabled', val)}
                                            classNames={{
                                                wrapper: "group-data-[selected=true]:bg-[#0070BA]"
                                            }}
                                        />
                                    </div>
                                    <div className={`transition-all duration-300 ${formData.paymentMethods.paypal?.enabled ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                        <Input
                                            label="CORREO PAYPAL"
                                            placeholder="correo@paypal.com"
                                            value={formData.paymentMethods.paypal?.email || ''}
                                            onChange={(e) => handlePaymentMethodChange('paypal', 'email', e.target.value)}
                                            variant="underlined"
                                            classNames={inputStyles}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>

                    {/* Tab 6: Banner y Anuncios */}
                    <Tab
                        key="promo"
                        title={
                            <div className="flex items-center space-x-2">
                                <Megaphone size={18} />
                                <span>Promociones</span>
                            </div>
                        }
                    >
                        <div className="py-8 grid gap-10 lg:grid-cols-2">
                            {/* Banner Promocional */}
                            <div className="bg-slate-50/80 rounded-[2rem] p-8 border border-slate-100">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Banner Promocional</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Muestra anuncios en tu tienda</p>
                                    </div>
                                    <Switch
                                        isSelected={formData.showPromoBanner}
                                        onValueChange={(val) => handleChange('showPromoBanner', val)}
                                        classNames={{
                                            wrapper: "group-data-[selected=true]:bg-slate-900"
                                        }}
                                    />
                                </div>

                                <div className={`space-y-6 transition-all duration-300 ${formData.showPromoBanner ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                    <Input
                                        label="TEXTO DEL BANNER"
                                        placeholder="¡Oferta especial! 20% de descuento"
                                        value={formData.promoBannerText}
                                        onChange={(e) => handleChange('promoBannerText', e.target.value)}
                                        variant="underlined"
                                        labelPlacement="outside"
                                        classNames={inputStyles}
                                    />
                                    <Input
                                        label="ENLACE (OPCIONAL)"
                                        placeholder="https://..."
                                        value={formData.promoBannerLink}
                                        onChange={(e) => handleChange('promoBannerLink', e.target.value)}
                                        variant="underlined"
                                        labelPlacement="outside"
                                        startContent={<Globe size={18} className="text-default-400" />}
                                        classNames={inputStyles}
                                    />
                                </div>
                            </div>

                            {/* Modo Mantenimiento */}
                            <div className={`bg-gradient-to-br from-white to-orange-50 rounded-[2rem] p-8 border ${formData.maintenanceMode ? 'border-orange-200' : 'border-slate-100'}`}>
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg text-orange-500">
                                            <AlertTriangle size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Modo Mantenimiento</h3>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Desactiva temporalmente la tienda</p>
                                        </div>
                                    </div>
                                    <Switch
                                        isSelected={formData.maintenanceMode}
                                        onValueChange={(val) => handleChange('maintenanceMode', val)}
                                        color="warning"
                                    />
                                </div>
                                <div className={`space-y-4 transition-all duration-300 ${formData.maintenanceMode ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                    <Textarea
                                        label="MENSAJE DE MANTENIMIENTO"
                                        placeholder="Estamos realizando mejoras. Volvemos pronto."
                                        value={formData.maintenanceMessage}
                                        onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                                        variant="underlined"
                                        labelPlacement="outside"
                                        classNames={textAreaStyles}
                                    />
                                </div>
                            </div>
                        </div>
                    </Tab>

                    {/* Tab 7: Legal */}
                    <Tab
                        key="legal"
                        title={
                            <div className="flex items-center space-x-2">
                                <FileText size={18} />
                                <span>Legal y SEO</span>
                            </div>
                        }
                    >
                        <div className="py-8 grid gap-10">
                            {/* Legal */}
                            <div className="grid lg:grid-cols-2 gap-10">
                                <div>
                                    <div className="mb-6">
                                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Términos y Condiciones</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Condiciones de uso de tu tienda</p>
                                    </div>
                                    <Textarea
                                        placeholder="Escribe aquí tus términos y condiciones..."
                                        value={formData.termsAndConditions}
                                        onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                                        variant="bordered"
                                        minRows={8}
                                        classNames={{
                                            ...textAreaStyles,
                                            inputWrapper: "bg-slate-50 border-slate-200"
                                        }}
                                    />
                                </div>

                                <div>
                                    <div className="mb-6">
                                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Política de Privacidad</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Cómo manejas los datos de tus clientes</p>
                                    </div>
                                    <Textarea
                                        placeholder="Escribe aquí tu política de privacidad..."
                                        value={formData.privacyPolicy}
                                        onChange={(e) => handleChange('privacyPolicy', e.target.value)}
                                        variant="bordered"
                                        minRows={8}
                                        classNames={{
                                            ...textAreaStyles,
                                            inputWrapper: "bg-slate-50 border-slate-200"
                                        }}
                                    />
                                </div>
                            </div>

                            <Divider className="my-4" />

                            {/* SEO */}
                            <div>
                                <div className="mb-8">
                                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Optimización SEO</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Mejora la visibilidad en buscadores</p>
                                </div>
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <Input
                                        label="TÍTULO SEO"
                                        placeholder="Mi Tienda - Las mejores cuentas de streaming"
                                        value={formData.seoTitle}
                                        onChange={(e) => handleChange('seoTitle', e.target.value)}
                                        variant="underlined"
                                        labelPlacement="outside"
                                        classNames={inputStyles}
                                    />
                                    <Input
                                        label="PALABRAS CLAVE"
                                        placeholder="streaming, netflix, spotify, cuentas"
                                        value={formData.seoKeywords}
                                        onChange={(e) => handleChange('seoKeywords', e.target.value)}
                                        variant="underlined"
                                        labelPlacement="outside"
                                        description="Separadas por coma"
                                        classNames={inputStyles}
                                    />
                                    <div className="lg:col-span-2">
                                        <Textarea
                                            label="DESCRIPCIÓN SEO"
                                            placeholder="Descripción corta que aparecerá en Google..."
                                            value={formData.seoDescription}
                                            onChange={(e) => handleChange('seoDescription', e.target.value)}
                                            variant="underlined"
                                            labelPlacement="outside"
                                            maxRows={3}
                                            classNames={textAreaStyles}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
                <div className="flex justify-end pt-4">
                    <Button
                        className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] h-12 px-10 rounded-xl shadow-lg hover:bg-slate-800 hover:scale-105 transition-all"
                        startContent={!isSaving && <Save size={18} />}
                        isLoading={isSaving}
                        onPress={handleSubmit}
                    >
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </PremiumCard>
        </PageContainer>
    );
};

export default StoreSettings;
