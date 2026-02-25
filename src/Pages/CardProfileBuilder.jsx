import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearCategoriesErrors,
    setSelectedCategory,
    clearSelectedCategory,
} from '../features/categories/categoriesSlice';
import CardProfilePreview from '../Components/CardProfilePreview';
import { addToast } from "@heroui/toast";
import {
    Input,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Spinner,
    Select,
    SelectItem,
    Tooltip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@heroui/react";
import {
    Palette,
    Save,
    Plus,
    Trash2,
    Edit3,
    Image as ImageIcon,
    RefreshCw,
    Wand2,
    Upload,
    CheckCircle2,
    X,
    Layers,
    Type,
    Sparkles
} from 'lucide-react';
import '../style/cardProfileBuilder.css';
import { PageContainer, PremiumHeader, PremiumCard } from "../Components/ui/PremiumComponents";

const GRADIENT_DIRECTIONS = [
    { value: 'to bottom', label: 'Arriba → Abajo' },
    { value: 'to top', label: 'Abajo → Arriba' },
    { value: 'to right', label: 'Izquierda → Derecha' },
    { value: 'to left', label: 'Derecha → Izquierda' },
    { value: 'to bottom right', label: 'Diagonal ↘' },
    { value: 'to bottom left', label: 'Diagonal ↙' },
    { value: 'to top right', label: 'Diagonal ↗' },
    { value: 'to top left', label: 'Diagonal ↖' },
    { value: '135deg', label: '135°' },
    { value: '45deg', label: '45°' },
];

const BACKGROUND_TYPES = [
    { value: 'solid', label: 'Color Sólido', icon: '■' },
    { value: 'linear-gradient', label: 'Gradiente Lineal', icon: '▤' },
    { value: 'radial-gradient', label: 'Gradiente Radial', icon: '◉' },
];

const CardProfileBuilder = () => {
    const dispatch = useDispatch();
    const { categories, isLoading, error, successMessage, selectedCategory } = useSelector((state) => state.categoriesCP);
    const fileInputRef = useRef(null);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        displayName: '',
        backgroundType: 'solid',
        backgroundColor: '#000000',
        gradientColors: ['#000000', '#333333'],
        gradientDirection: 'to bottom',
        logoSize: 'medium',
    });

    // Estado para la imagen
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // Estado de UI
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Cargar categorías al montar
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Manejar mensajes de éxito/error
    useEffect(() => {
        if (successMessage) {
            addToast({ title: "Éxito", description: successMessage, color: "success" });
            setIsSaving(false);
            dispatch(clearCategoriesErrors());

            // Resetear formulario si se creó/actualizó
            if (!isEditing) {
                resetForm();
            }
        }
        if (error) {
            addToast({ title: "Error", description: error, color: "danger" });
            setIsSaving(false);
            dispatch(clearCategoriesErrors());
        }
    }, [successMessage, error, dispatch, isEditing]);

    // Cargar datos cuando se selecciona una categoría para editar
    useEffect(() => {
        if (selectedCategory) {
            setFormData({
                name: selectedCategory.name || '',
                displayName: selectedCategory.displayName || '',
                backgroundType: selectedCategory.backgroundType || 'solid',
                backgroundColor: selectedCategory.backgroundColor || '#000000',
                gradientColors: selectedCategory.gradientColors || ['#000000', '#333333'],
                gradientDirection: selectedCategory.gradientDirection || 'to bottom',
                logoSize: selectedCategory.logoSize || 'medium',
            });
            setLogoPreview(selectedCategory.logoPublicUrl || null);
            setLogoFile(null);
            setIsEditing(true);
        }
    }, [selectedCategory]);

    const resetForm = () => {
        setFormData({
            name: '',
            displayName: '',
            backgroundType: 'solid',
            backgroundColor: '#000000',
            gradientColors: ['#000000', '#333333'],
            gradientDirection: 'to bottom',
            logoSize: 'medium',
        });
        setLogoFile(null);
        setLogoPreview(null);
        setIsEditing(false);
        dispatch(clearSelectedCategory());
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGradientColorChange = (index, color) => {
        const newColors = [...formData.gradientColors];
        newColors[index] = color;
        setFormData(prev => ({ ...prev, gradientColors: newColors }));
    };

    const addGradientColor = () => {
        if (formData.gradientColors.length < 4) {
            setFormData(prev => ({
                ...prev,
                gradientColors: [...prev.gradientColors, '#666666']
            }));
        }
    };

    const removeGradientColor = (index) => {
        if (formData.gradientColors.length > 2) {
            const newColors = formData.gradientColors.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, gradientColors: newColors }));
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                addToast({ title: "Error", description: 'Formato de imagen no válido. Usa JPG, PNG, GIF, WEBP o SVG.', color: "danger" });
                return;
            }

            // Validar tamaño (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                addToast({ title: "Error", description: 'La imagen es muy grande. Máximo 5MB.', color: "danger" });
                return;
            }

            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.name.trim()) {
            return addToast({ title: "Error", description: "El nombre interno es obligatorio", color: "danger" });
        }

        // Solo validar el formato del nombre interno al CREAR.
        // En edición, se permite mantener nombres antiguos que no cumplen este patrón.
        if (!isEditing && !formData.name.match(/^[a-z0-9_]+$/)) {
            return addToast({ title: "Error", description: "El nombre interno solo puede contener letras minúsculas, números y guiones bajos", color: "danger" });
        }

        setIsSaving(true);

        // Preparar FormData para envío
        const submitData = new FormData();
        submitData.append('name', formData.name.toLowerCase());
        submitData.append('displayName', formData.displayName || formData.name);
        submitData.append('backgroundType', formData.backgroundType);
        submitData.append('backgroundColor', formData.backgroundColor);
        submitData.append('gradientColors', JSON.stringify(formData.gradientColors));
        submitData.append('gradientDirection', formData.gradientDirection);
        submitData.append('logoSize', formData.logoSize);

        if (logoFile) {
            submitData.append('logo', logoFile);
        }

        if (isEditing && selectedCategory) {
            dispatch(updateCategory({ id: selectedCategory.id, formData: submitData }));
        } else {
            dispatch(createCategory(submitData));
        }
    };

    const handleEditCategory = (category) => {
        dispatch(setSelectedCategory(category));
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        onDeleteOpen();
    };

    const handleConfirmDelete = () => {
        if (categoryToDelete) {
            dispatch(deleteCategory(categoryToDelete.id));
            onDeleteClose();
            setCategoryToDelete(null);
            if (selectedCategory?.id === categoryToDelete.id) {
                resetForm();
            }
        }
    };

    if (isLoading && categories.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Spinner size="lg" color="primary" />
                    <p className="text-default-500">Cargando categorías...</p>
                </div>
            </div>
        );
    }

    return (
        <PageContainer>

            {/* Header */}
            <PremiumHeader
                title="Constructor de Cards"
                description="CREA Y PERSONALIZA LAS CARDS DE CATEGORÍAS CON PREVISUALIZACIÓN EN TIEMPO REAL"
                icon={Layers}
                action={
                    null
                }
            />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Panel de Previsualización */}
                <PremiumCard className="order-1 lg:order-1 flex flex-col h-full border-none shadow-none bg-transparent lg:bg-white lg:border lg:border-slate-200 lg:shadow-xl lg:rounded-[2.5rem]">
                    <div className="flex items-center gap-3 p-2 lg:p-0 mb-6 lg:mb-6">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <Sparkles size={20} />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg font-extrabold text-slate-900 tracking-tight">Previsualización en Vivo</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Así se verá tu card</p>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center min-h-[450px] bg-gradient-to-br from-slate-50 to-white rounded-[2rem] border border-slate-100 p-8 shadow-inner">
                        <div className="card-preview-container scale-110">
                            <CardProfilePreview
                                logoUrl={logoPreview}
                                displayName={formData.displayName || formData.name || 'Nueva Categoría'}
                                backgroundType={formData.backgroundType}
                                backgroundColor={formData.backgroundColor}
                                gradientColors={formData.gradientColors}
                                gradientDirection={formData.gradientDirection}
                                logoSize={formData.logoSize}
                                total="10"
                                showAvailability={true}
                            />
                        </div>
                    </div>
                </PremiumCard>

                {/* Panel de Configuración */}
                <PremiumCard className="order-2 lg:order-2 h-full">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                <Palette size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-lg font-extrabold text-slate-900 tracking-tight">
                                    {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Configura los estilos</p>
                            </div>
                        </div>
                        {isEditing && (
                            <Button
                                size="sm"
                                variant="light"
                                color="default"
                                startContent={<Plus size={16} />}
                                onPress={resetForm}
                                className="font-bold text-slate-500"
                            >
                                Nueva
                            </Button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nombre interno */}
                        <Input
                            label="NOMBRE INTERNO"
                            placeholder="netflix, hbo_max..."
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''))}
                            isRequired
                            variant="bordered"
                            labelPlacement="outside"
                            startContent={<Type size={18} className="text-slate-300" />}
                            description="Identificador único (sin espacios, solo minúsculas)"
                            isDisabled={isEditing}
                            classNames={{
                                label: "text-slate-400 font-bold tracking-wider text-[10px]",
                                input: "text-slate-800 font-semibold",
                                inputWrapper: "border-slate-200 h-12 bg-slate-50/50 hover:bg-white focus-within:bg-white transition-colors"
                            }}
                        />

                        {/* Nombre visible */}
                        <Input
                            label="NOMBRE VISIBLE"
                            placeholder="Netflix Original..."
                            value={formData.displayName}
                            onChange={(e) => handleChange('displayName', e.target.value)}
                            variant="bordered"
                            labelPlacement="outside"
                            startContent={<Type size={18} className="text-slate-300" />}
                            description="Nombre que verán los usuarios"
                            classNames={{
                                label: "text-slate-400 font-bold tracking-wider text-[10px]",
                                input: "text-slate-800 font-semibold",
                                inputWrapper: "border-slate-200 h-12 bg-slate-50/50 hover:bg-white focus-within:bg-white transition-colors"
                            }}
                        />

                        {/* Logo/Imagen */}
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-3 flex items-center gap-2">
                                <ImageIcon size={14} />
                                Logo / Imagen
                            </label>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleLogoChange}
                                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                                    className="hidden"
                                />
                                <Button
                                    className="bg-white border border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px] shadow-sm hover:translate-y-[-2px] transition-transform"
                                    startContent={<ImageIcon size={16} />}
                                    onPress={() => fileInputRef.current?.click()}
                                >
                                    {logoPreview ? 'Cambiar imagen' : 'Subir imagen'}
                                </Button>
                                {logoPreview && (
                                    <div className="flex items-center gap-2 ml-auto">
                                        <div className="h-12 w-12 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                                            <img
                                                src={logoPreview}
                                                alt="Preview"
                                                className="h-full w-full object-contain rounded-lg"
                                            />
                                        </div>
                                        <Tooltip content="Eliminar imagen">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="danger"
                                                onPress={handleRemoveLogo}
                                                className="opacity-50 hover:opacity-100"
                                            >
                                                <X size={16} />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Divider className="my-6 border-slate-100" />

                        {/* Tamaño del Logo */}
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-3 flex items-center gap-2">
                                <ImageIcon size={14} />
                                Tamaño del Logo
                            </label>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { value: 'small', label: 'Pequeño', desc: '50%' },
                                    { value: 'medium', label: 'Mediano', desc: '75%' },
                                    { value: 'large', label: 'Grande', desc: '90%' },
                                    { value: 'full', label: 'Completo', desc: '100%' },
                                ].map((size) => (
                                    <Button
                                        key={size.value}
                                        variant="bordered"
                                        onPress={() => handleChange('logoSize', size.value)}
                                        className={`h-auto py-3 flex-col gap-1 rounded-2xl border transition-all ${
                                            formData.logoSize === size.value
                                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-md ring-2 ring-indigo-600/10'
                                                : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{size.label}</span>
                                        <span className="text-[9px] text-slate-400">{size.desc}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Divider className="my-6 border-slate-100" />

                        {/* Tipo de fondo */}
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-3 flex items-center gap-2">
                                <Palette size={14} />
                                Tipo de Fondo
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {BACKGROUND_TYPES.map((type) => (
                                    <Button
                                        key={type.value}
                                        variant="bordered"
                                        onPress={() => handleChange('backgroundType', type.value)}
                                        className={`h-auto py-4 flex-col gap-2 rounded-2xl border transition-all ${formData.backgroundType === type.value
                                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-md ring-2 ring-indigo-600/10'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className="text-xl opacity-80">{type.icon}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Colores */}
                        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                            {formData.backgroundType === 'solid' ? (
                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-3">
                                        Color de Fondo
                                    </label>
                                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                                        <input
                                            type="color"
                                            value={formData.backgroundColor}
                                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                            className="w-12 h-12 rounded-lg border-none cursor-pointer p-0 bg-transparent"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">Color Principal</p>
                                            <p className="text-[10px] font-mono text-slate-400 uppercase">{formData.backgroundColor}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                                            Colores del Gradiente
                                        </label>
                                        {formData.gradientColors.length < 4 && (
                                            <Button
                                                size="sm"
                                                variant="light"
                                                startContent={<Plus size={14} />}
                                                onPress={addGradientColor}
                                                className="text-indigo-600 font-bold text-[10px] uppercase tracking-wider"
                                            >
                                                Añadir color
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {formData.gradientColors.map((color, index) => (
                                            <div key={index} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                                                <input
                                                    type="color"
                                                    value={color}
                                                    onChange={(e) => handleGradientColorChange(index, e.target.value)}
                                                    className="w-10 h-10 rounded-lg border-none cursor-pointer p-0 bg-transparent"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-700">Color {index + 1}</p>
                                                    <p className="text-[10px] font-mono text-slate-400 uppercase">{color}</p>
                                                </div>
                                                {formData.gradientColors.length > 2 && (
                                                    <Tooltip content="Eliminar color">
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            color="danger"
                                                            onPress={() => removeGradientColor(index)}
                                                            className="opacity-50 hover:opacity-100"
                                                        >
                                                            <X size={14} />
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Dirección del gradiente (solo para linear) */}
                                    {formData.backgroundType === 'linear-gradient' && (
                                        <Select
                                            label="DIRECCIÓN"
                                            labelPlacement="outside"
                                            selectedKeys={[formData.gradientDirection]}
                                            onSelectionChange={(keys) => handleChange('gradientDirection', Array.from(keys)[0])}
                                            variant="bordered"
                                            classNames={{
                                                label: "text-slate-400 font-bold tracking-wider text-[10px]",
                                                trigger: "border-slate-200 bg-white h-12",
                                                value: "text-slate-800 font-semibold"
                                            }}
                                        >
                                            {GRADIENT_DIRECTIONS.map((dir) => (
                                                <SelectItem key={dir.value} value={dir.value}>
                                                    {dir.label}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                </div>
                            )}
                        </div>

                        <Divider className="my-6 border-slate-100" />

                        {/* Botones de acción */}
                        <div className="flex gap-4 pt-2">
                            <Button
                                type="submit"
                                className="flex-1 bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] h-12 rounded-xl shadow-lg hover:bg-slate-800 hover:scale-[1.02] transition-all"
                                isLoading={isSaving}
                                startContent={!isSaving && <Save size={18} />}
                            >
                                {isSaving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Categoría')}
                            </Button>
                            {isEditing && (
                                <Button
                                    type="button"
                                    className="bg-white text-slate-700 border border-slate-200 font-bold uppercase tracking-wider text-[11px] h-12 rounded-xl hover:bg-slate-50"
                                    onPress={resetForm}
                                    startContent={<RefreshCw size={18} />}
                                >
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </form>
                </PremiumCard>
            </div>

            {/* Lista de Categorías Existentes */}
            <PremiumCard className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                        <Layers size={20} />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-lg font-extrabold text-slate-900 tracking-tight">Categorías Existentes ({categories.length})</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Haz clic en una card para editarla</p>
                    </div>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-[2rem] border border-slate-100 min-h-[200px]">
                    {categories.length === 0 ? (
                        <div className="text-center py-12 text-default-400">
                            <Layers size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No hay categorías creadas aún</p>
                            <p className="text-sm">Crea tu primera categoría usando el formulario de arriba</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-8 justify-center py-8">
                            {categories.map((category) => (
                                <div key={category.id} className="relative group cursor-pointer hover:scale-105 transition-transform duration-300">
                                    <div className="drop-shadow-xl">
                                        <CardProfilePreview
                                            logoUrl={category.logoPublicUrl}
                                            displayName={category.displayName || category.name}
                                            backgroundType={category.backgroundType}
                                            backgroundColor={category.backgroundColor}
                                            gradientColors={category.gradientColors}
                                            gradientDirection={category.gradientDirection}
                                            logoSize={category.logoSize || 'medium'}
                                            total="10"
                                            showAvailability={false}
                                            onClick={() => handleEditCategory(category)}
                                        />
                                    </div>

                                    {/* Overlay de acciones */}
                                    <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] rounded-[32px] flex items-center justify-center gap-3">
                                        <Tooltip content="Editar">
                                            <Button
                                                isIconOnly
                                                className="bg-white text-slate-900 shadow-xl rounded-full"
                                                onPress={() => handleEditCategory(category)}
                                            >
                                                <Edit3 size={18} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Eliminar">
                                            <Button
                                                isIconOnly
                                                className="bg-rose-500 text-white shadow-xl rounded-full"
                                                onPress={() => handleDeleteClick(category)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </Tooltip>
                                    </div>

                                    {/* Nombre de la categoría */}
                                    <p className="text-center mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
                                        {category.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PremiumCard>

            {/* Modal de confirmación de eliminación */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-slate-900 font-bold">
                        Confirmar Eliminación
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-slate-600">
                            ¿Estás seguro de que deseas eliminar la categoría{' '}
                            <strong className="text-slate-900">{categoryToDelete?.displayName || categoryToDelete?.name}</strong>?
                        </p>
                        <p className="text-xs text-rose-500 font-medium bg-rose-50 p-2 rounded-lg">
                            Esta acción no se puede deshacer.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={onDeleteClose} className="font-semibold">
                            Cancelar
                        </Button>
                        <Button color="danger" onPress={handleConfirmDelete} className="font-bold">
                            Eliminar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </PageContainer>
    );
};

export default CardProfileBuilder;
