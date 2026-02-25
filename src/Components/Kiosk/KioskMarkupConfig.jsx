import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategoryMarkup, getMarkupConfiguration, fetchAllCategoriesForMarkup } from '../../features/kiosk/kioskSlice';
import { categoryImageMap, getCategoryImage } from '../../utils/categoryImages';
import { Card, CardBody, Divider, Button, Input, ButtonGroup, Chip, Spinner, Switch, Tabs, Tab } from "@heroui/react";
import { Coins, Percent, DollarSign, Save, AlertCircle, RefreshCw, User, CreditCard, Package, FileKey, Search, X } from 'lucide-react';
import { addToast } from "@heroui/toast";

const KioskMarkupConfig = () => {
    const dispatch = useDispatch();
    const { markupConfig, profileCategories, accountCategories, combosList, licensesList, isLoading } = useSelector((state) => state.kiosk);
    const [localMarkups, setLocalMarkups] = useState({});
    const [savingItem, setSavingItem] = useState(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [activeTab, setActiveTab] = useState('profiles');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoadingCategories(true);
            try {
                await Promise.all([
                    dispatch(getMarkupConfiguration()).unwrap(),
                    dispatch(fetchAllCategoriesForMarkup()).unwrap()
                ]);
            } catch (err) {
                console.error('Error loading kiosk data:', err);
            } finally {
                setLoadingCategories(false);
            }
        };
        loadData();
    }, [dispatch]);

    useEffect(() => {
        const initialMap = {};
        markupConfig.forEach(m => {
            const key = m.categoryId
                ? `${m.productType}-cat-${m.categoryId}`
                : `${m.productType}-prod-${m.productId}`;
            initialMap[key] = {
                type: m.markupType,
                value: m.markupValue,
                isActive: m.isActive
            };
        });
        setLocalMarkups(prev => ({ ...prev, ...initialMap }));
    }, [markupConfig]);

    const getKey = (productType, categoryId, productId) => {
        return categoryId
            ? `${productType}-cat-${categoryId}`
            : `${productType}-prod-${productId}`;
    };

    const handleUpdate = (productType, categoryId, productId, field, value) => {
        const key = getKey(productType, categoryId, productId);
        setLocalMarkups(prev => {
            const current = prev[key] || { type: 'fixed', value: 0, isActive: false };
            return {
                ...prev,
                [key]: {
                    ...current,
                    [field]: value
                }
            };
        });
    };

    const handleSave = async (productType, categoryId, productId, displayName) => {
        const key = getKey(productType, categoryId, productId);
        const config = localMarkups[key];
        setSavingItem(key);
        try {
            await dispatch(updateCategoryMarkup({
                categoryId: categoryId || undefined,
                productId: productId || undefined,
                productType,
                markupType: config?.type || 'fixed',
                markupValue: parseInt(config?.value) || 0,
                isActive: config?.isActive ?? false
            })).unwrap();
            addToast({ title: 'Éxito', description: `${displayName} actualizado`, color: 'success' });
        } catch (err) {
            addToast({ title: 'Error', description: `Error al guardar: ${err}`, color: 'danger' });
        } finally {
            setSavingItem(null);
        }
    };

    const handleToggleVisibility = async (productType, categoryId, productId, displayName, currentValue) => {
        const key = getKey(productType, categoryId, productId);
        const newValue = !currentValue;
        handleUpdate(productType, categoryId, productId, 'isActive', newValue);

        const config = localMarkups[key];
        setSavingItem(key);
        try {
            await dispatch(updateCategoryMarkup({
                categoryId: categoryId || undefined,
                productId: productId || undefined,
                productType,
                markupType: config?.type || 'fixed',
                markupValue: parseInt(config?.value) || 0,
                isActive: newValue
            })).unwrap();
            addToast({ title: 'Éxito', description: `${displayName} ${newValue ? 'activado' : 'desactivado'}`, color: 'success' });
        } catch (err) {
            addToast({ title: 'Error', description: `Error al cambiar visibilidad`, color: 'danger' });
            handleUpdate(productType, categoryId, productId, 'isActive', currentValue);
        } finally {
            setSavingItem(null);
        }
    };

    const calculatePreview = (productType, categoryId, productId) => {
        const key = getKey(productType, categoryId, productId);
        const config = localMarkups[key];
        if (!config || !config.value) return null;

        const value = parseFloat(config.value) || 0;
        if (config.type === 'fixed') {
            return `+$${value.toLocaleString()}`;
        } else {
            return `+${value}%`;
        }
    };

    const isVisible = (productType, categoryId, productId) => {
        const key = getKey(productType, categoryId, productId);
        return localMarkups[key]?.isActive ?? false;
    };

    const filterBySearch = (name) => {
        if (!searchQuery.trim()) return true;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    };

    const filteredProfiles = profileCategories.filter(cat => filterBySearch(cat.name));
    const filteredAccounts = accountCategories.filter(cat => filterBySearch(cat.name));
    const filteredCombos = combosList.filter(combo => filterBySearch(combo.name));
    const filteredLicenses = licensesList.filter(lic => filterBySearch(lic.name));

    const visibleProfiles = profileCategories.filter(cat => isVisible('profile', cat.id, null)).length;
    const visibleAccounts = accountCategories.filter(cat => isVisible('account', cat.id, null)).length;
    const visibleCombos = combosList.filter(combo => isVisible('combo', null, combo.id)).length;
    const visibleLicenses = licensesList.filter(lic => isVisible('license', null, lic.id)).length;

    // Category row component redesign
    const CategoryRow = ({ cat, productType }) => {
        const key = getKey(productType, cat.id, null);
        const visible = isVisible(productType, cat.id, null);
        const [img, displayName] = getCategoryImage(cat.name);

        return (
            <Card className={`group border-2 transition-all duration-500 rounded-[2rem] overflow-hidden ${visible
                ? 'border-blue-500/30 bg-white shadow-xl shadow-blue-500/5'
                : 'border-slate-100 bg-slate-50/50 opacity-70 grayscale-[0.5]'
                }`}>
                <CardBody className="p-0">
                    <div className={`p-6 flex items-center justify-between gap-4 ${visible ? 'bg-gradient-to-r from-blue-50/50 to-transparent' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className={`absolute -inset-2 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl blur-lg transition-opacity duration-500 ${visible ? 'opacity-20 group-hover:opacity-30' : 'opacity-0'}`} />
                                <div className="relative bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center w-14 h-14">
                                    {img ? (
                                        <img src={img} alt={displayName} className="w-10 h-10 object-contain" />
                                    ) : (
                                        <Package size={28} className="text-slate-400" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                                    {displayName}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                    {cat.total} Unidades
                                </p>
                            </div>
                        </div>
                        <Switch
                            size="md"
                            isSelected={visible}
                            onValueChange={() => handleToggleVisibility(productType, cat.id, null, displayName, visible)}
                            isDisabled={savingItem === key}
                            color="success"
                        />
                    </div>

                    {visible && (
                        <div className="px-6 pb-6 space-y-5 animate-in slide-in-from-top-2 duration-400">
                            <div className="pt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2 px-1">Modalidad</label>
                                    <ButtonGroup className="w-full bg-slate-100/80 p-1 rounded-xl">
                                        <Button
                                            size="sm"
                                            className={`flex-1 rounded-lg font-bold uppercase text-[9px] tracking-wider transition-all h-8 ${localMarkups[key]?.type !== 'percentage'
                                                ? 'bg-white shadow-sm text-blue-600'
                                                : 'bg-transparent text-slate-400'
                                                }`}
                                            onPress={() => handleUpdate(productType, cat.id, null, 'type', 'fixed')}
                                        >
                                            Fijo
                                        </Button>
                                        <Button
                                            size="sm"
                                            className={`flex-1 rounded-lg font-bold uppercase text-[9px] tracking-wider transition-all h-8 ${localMarkups[key]?.type === 'percentage'
                                                ? 'bg-white shadow-sm text-blue-600'
                                                : 'bg-transparent text-slate-400'
                                                }`}
                                            onPress={() => handleUpdate(productType, cat.id, null, 'type', 'percentage')}
                                        >
                                            %
                                        </Button>
                                    </ButtonGroup>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block px-1">Valor</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        variant="flat"
                                        value={localMarkups[key]?.value || ''}
                                        onChange={(e) => handleUpdate(productType, cat.id, null, 'value', parseInt(e.target.value) || 0)}
                                        classNames={{
                                            input: "font-bold text-slate-900",
                                            inputWrapper: "bg-slate-50 border border-slate-100 rounded-xl h-10 group-data-[focus=true]:border-blue-500/50"
                                        }}
                                        startContent={
                                            <span className="text-blue-600 font-black text-sm">
                                                {localMarkups[key]?.type === 'percentage' ? '%' : '$'}
                                            </span>
                                        }
                                    />
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        color="primary"
                                        size="md"
                                        fullWidth
                                        onPress={() => handleSave(productType, cat.id, null, displayName)}
                                        isLoading={savingItem === key}
                                        className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] h-10 rounded-xl shadow-lg hover:bg-black"
                                        startContent={savingItem !== key && <Save size={14} />}
                                    >
                                        Guardar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        );
    };

    // Product row component redesign
    const ProductRow = ({ product, productType }) => {
        const key = getKey(productType, null, product.id);
        const visible = isVisible(productType, null, product.id);
        const displayName = product.name;
        const isCombo = productType === 'combo';

        return (
            <Card className={`group border-2 transition-all duration-500 rounded-[2rem] overflow-hidden ${visible
                ? 'border-indigo-500/30 bg-white shadow-xl shadow-indigo-500/5'
                : 'border-slate-100 bg-slate-50/50 opacity-70 grayscale-[0.5]'
                }`}>
                <CardBody className="p-0">
                    <div className={`p-6 flex items-center justify-between gap-4 ${visible ? 'bg-gradient-to-r from-indigo-50/50 to-transparent' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className={`absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl blur-lg transition-opacity duration-500 ${visible ? 'opacity-20 group-hover:opacity-30' : 'opacity-0'}`} />
                                <div className="relative bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center w-14 h-14">
                                    {isCombo
                                        ? <Package size={28} className="text-indigo-600" />
                                        : <FileKey size={28} className="text-indigo-600" />
                                    }
                                </div>
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                                    {displayName}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                    Base: <span className="text-slate-600">${product.price?.toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                        <Switch
                            size="md"
                            isSelected={visible}
                            onValueChange={() => handleToggleVisibility(productType, null, product.id, displayName, visible)}
                            isDisabled={savingItem === key}
                            color="success"
                        />
                    </div>

                    {visible && (
                        <div className="px-6 pb-6 space-y-5 animate-in slide-in-from-top-2 duration-400">
                            <div className="pt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2 px-1">Modalidad</label>
                                    <ButtonGroup className="w-full bg-slate-100/80 p-1 rounded-xl">
                                        <Button
                                            size="sm"
                                            className={`flex-1 rounded-lg font-bold uppercase text-[9px] tracking-wider transition-all h-8 ${localMarkups[key]?.type !== 'percentage'
                                                ? 'bg-white shadow-sm text-indigo-600'
                                                : 'bg-transparent text-slate-400'
                                                }`}
                                            onPress={() => handleUpdate(productType, null, product.id, 'type', 'fixed')}
                                        >
                                            Fijo
                                        </Button>
                                        <Button
                                            size="sm"
                                            className={`flex-1 rounded-lg font-bold uppercase text-[9px] tracking-wider transition-all h-8 ${localMarkups[key]?.type === 'percentage'
                                                ? 'bg-white shadow-sm text-indigo-600'
                                                : 'bg-transparent text-slate-400'
                                                }`}
                                            onPress={() => handleUpdate(productType, null, product.id, 'type', 'percentage')}
                                        >
                                            %
                                        </Button>
                                    </ButtonGroup>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block px-1">Valor</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        variant="flat"
                                        value={localMarkups[key]?.value || ''}
                                        onChange={(e) => handleUpdate(productType, null, product.id, 'value', parseInt(e.target.value) || 0)}
                                        classNames={{
                                            input: "font-bold text-slate-900",
                                            inputWrapper: "bg-slate-50 border border-slate-100 rounded-xl h-10 group-data-[focus=true]:border-indigo-500/50"
                                        }}
                                        startContent={
                                            <span className="text-indigo-600 font-black text-sm">
                                                {localMarkups[key]?.type === 'percentage' ? '%' : '$'}
                                            </span>
                                        }
                                    />
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        color="primary"
                                        size="md"
                                        fullWidth
                                        onPress={() => handleSave(productType, null, product.id, displayName)}
                                        isLoading={savingItem === key}
                                        className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] h-10 rounded-xl shadow-lg hover:bg-black"
                                        startContent={savingItem !== key && <Save size={14} />}
                                    >
                                        Guardar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        );
    };

    if (loadingCategories) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Spinner size="lg" color="primary" label="Sincronizando productos..." labelColor="primary" />
            </div>
        );
    }

    const totalItems = profileCategories.length + accountCategories.length + combosList.length + licensesList.length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Catálogo y Precios</h2>
                        <p className="text-slate-500 text-sm font-semibold italic">Ajusta tus márgenes y visibilidad en tiempo real.</p>
                    </div>
                    <Input
                        placeholder="BUSCAR PRODUCTO..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="underlined"
                        size="sm"
                        className="max-w-xs"
                        classNames={{
                            label: "text-slate-400 font-bold tracking-wider text-[10px]",
                            input: "text-slate-800 font-bold uppercase",
                            inputWrapper: "border-slate-200 h-11"
                        }}
                        startContent={<Search size={18} className="text-slate-400" />}
                        endContent={
                            searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                                    <X size={16} />
                                </button>
                            )
                        }
                    />
                </div>

                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={setActiveTab}
                    variant="light"
                    radius="full"
                    size="lg"
                    classNames={{
                        tabList: "gap-2 p-1.5 w-full md:w-max flex bg-slate-100/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/50 shadow-inner-sm overflow-x-auto no-scrollbar",
                        cursor: "bg-slate-900 shadow-2xl border border-slate-800",
                        tab: "h-12 px-6 md:px-8 shrink-0 flex-1 md:flex-initial",
                        tabContent: "font-bold uppercase text-[11px] tracking-[0.1em] group-data-[selected=true]:text-white text-slate-500 transition-all duration-300"
                    }}
                >
                    <Tab
                        key="profiles"
                        title={
                            <div className="flex items-center gap-2">
                                <span>Perfiles</span>
                                <span className={`text-[10px] px-2 py-0.5 min-w-[20px] flex items-center justify-center rounded-md font-bold transition-all ${activeTab === 'profiles' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    {visibleProfiles}
                                </span>
                            </div>
                        }
                    >
                        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in pl-1">
                            {filteredProfiles.length === 0 ? (
                                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200/60">
                                    <User size={48} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin resultados</p>
                                </div>
                            ) : filteredProfiles.map(cat => <CategoryRow key={cat.id} cat={cat} productType="profile" />)}
                        </div>
                    </Tab>

                    <Tab
                        key="accounts"
                        title={
                            <div className="flex items-center gap-2">
                                <span>Cuentas</span>
                                <span className={`text-[10px] px-2 py-0.5 min-w-[20px] flex items-center justify-center rounded-md font-bold transition-all ${activeTab === 'accounts' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    {visibleAccounts}
                                </span>
                            </div>
                        }
                    >
                        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in pl-1">
                            {filteredAccounts.length === 0 ? (
                                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200/60">
                                    <CreditCard size={48} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin resultados</p>
                                </div>
                            ) : filteredAccounts.map(cat => <CategoryRow key={cat.id} cat={cat} productType="account" />)}
                        </div>
                    </Tab>

                    <Tab
                        key="combos"
                        title={
                            <div className="flex items-center gap-2">
                                <span>Combos</span>
                                <span className={`text-[10px] px-2 py-0.5 min-w-[20px] flex items-center justify-center rounded-md font-bold transition-all ${activeTab === 'combos' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    {visibleCombos}
                                </span>
                            </div>
                        }
                    >
                        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in pl-1">
                            {filteredCombos.length === 0 ? (
                                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200/60">
                                    <Package size={48} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin resultados</p>
                                </div>
                            ) : filteredCombos.map(combo => <ProductRow key={combo.id} product={combo} productType="combo" />)}
                        </div>
                    </Tab>

                    <Tab
                        key="licenses"
                        title={
                            <div className="flex items-center gap-2">
                                <span>Servicios</span>
                                <span className={`text-[10px] px-2 py-0.5 min-w-[20px] flex items-center justify-center rounded-md font-bold transition-all ${activeTab === 'licenses' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    {visibleLicenses}
                                </span>
                            </div>
                        }
                    >
                        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in pl-1">
                            {filteredLicenses.length === 0 ? (
                                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200/60">
                                    <FileKey size={48} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin resultados</p>
                                </div>
                            ) : filteredLicenses.map(lic => <ProductRow key={lic.id} product={lic} productType="license" />)}
                        </div>
                    </Tab>
                </Tabs>
            </div>

            {/* Resumen Sidebar Area */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm sticky top-6">
                    <header className="mb-10 text-center md:text-left">
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Análisis de Stock</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Configuración actual del canal</p>
                    </header>

                    <div className="space-y-5">
                        {[
                            { label: 'Perfiles Activos', value: visibleProfiles, icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Cuentas Activas', value: visibleAccounts, icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Combos Habilitados', value: visibleCombos, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Otros Servicios', value: visibleLicenses, icon: FileKey, color: 'text-orange-600', bg: 'bg-orange-50' },
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <span className="text-sm font-extrabold text-slate-700 tracking-tight">{stat.label}</span>
                                </div>
                                <span className="text-lg font-black text-slate-900">{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    <Divider className="my-8 bg-slate-100" />

                    <div className="bg-slate-900 p-8 rounded-[2rem] text-center space-y-1 relative overflow-hidden group shadow-2xl shadow-slate-900/20">
                        <div className="absolute top-0 right-0 p-12 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-700" />
                        <div className="absolute bottom-0 left-0 p-12 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 group-hover:bg-indigo-500/20 transition-all duration-700" />

                        <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] relative z-10">Total Productos</h4>
                        <p className="text-6xl font-black text-white tracking-tighter relative z-10 transition-transform duration-500 group-hover:scale-110">
                            {visibleProfiles + visibleAccounts + visibleCombos + visibleLicenses}
                        </p>
                        <div className="pt-2 relative z-10">
                            <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-emerald-500/20">
                                Tienda Sincronizada
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default KioskMarkupConfig;
