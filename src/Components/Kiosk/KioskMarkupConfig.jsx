import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategoryMarkup, getMarkupConfiguration, fetchAllCategoriesForMarkup } from '../../features/kiosk/kioskSlice';
import { Card, CardBody, Button, ButtonGroup, Input, Spinner, Switch, Tabs, Tab } from "@heroui/react";
import { Save, User, CreditCard, Package, FileKey, Search, X, Eye, EyeOff } from 'lucide-react';
import { addToast } from "@heroui/toast";

const KioskMarkupConfig = () => {
    const dispatch = useDispatch();
    const { markupConfig, profileCategories, accountCategories, combosList, licensesList } = useSelector((state) => state.kiosk);
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
            return { ...prev, [key]: { ...current, [field]: value } };
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
    const totalVisible = visibleProfiles + visibleAccounts + visibleCombos + visibleLicenses;

    const MarkupControls = ({ markupKey, productType, categoryId, productId, displayName, accentColor = 'blue' }) => {
        const config = localMarkups[markupKey];
        const colors = {
            blue: { btn: 'text-blue-600', focus: 'group-data-[focus=true]:border-blue-500/50' },
            indigo: { btn: 'text-indigo-600', focus: 'group-data-[focus=true]:border-indigo-500/50' },
        };
        const c = colors[accentColor] || colors.blue;

        return (
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <ButtonGroup className="bg-slate-100 p-0.5 rounded-lg shrink-0">
                    <Button
                        size="sm"
                        isIconOnly
                        className={`w-8 h-8 min-w-8 rounded-md text-xs font-bold ${config?.type !== 'percentage' ? 'bg-white shadow-sm ' + c.btn : 'bg-transparent text-slate-400'}`}
                        onPress={() => handleUpdate(productType, categoryId, productId, 'type', 'fixed')}
                    >$</Button>
                    <Button
                        size="sm"
                        isIconOnly
                        className={`w-8 h-8 min-w-8 rounded-md text-xs font-bold ${config?.type === 'percentage' ? 'bg-white shadow-sm ' + c.btn : 'bg-transparent text-slate-400'}`}
                        onPress={() => handleUpdate(productType, categoryId, productId, 'type', 'percentage')}
                    >%</Button>
                </ButtonGroup>
                <Input
                    type="number"
                    placeholder="0"
                    variant="flat"
                    size="sm"
                    value={config?.value || ''}
                    onChange={(e) => handleUpdate(productType, categoryId, productId, 'value', parseInt(e.target.value) || 0)}
                    classNames={{
                        input: "font-bold text-slate-900 text-sm",
                        inputWrapper: `bg-slate-50 border border-slate-100 rounded-lg h-8 min-h-8 ${c.focus}`
                    }}
                    startContent={<span className={`${c.btn} font-black text-xs`}>{config?.type === 'percentage' ? '%' : '$'}</span>}
                />
                <Button
                    size="sm"
                    isIconOnly
                    onPress={() => handleSave(productType, categoryId, productId, displayName)}
                    isLoading={savingItem === markupKey}
                    className="bg-slate-900 text-white w-8 h-8 min-w-8 rounded-lg shrink-0"
                >
                    {savingItem !== markupKey && <Save size={14} />}
                </Button>
            </div>
        );
    };

    const CategoryRow = ({ cat, productType }) => {
        const key = getKey(productType, cat.id, null);
        const visible = isVisible(productType, cat.id, null);
        const displayName = cat.name;

        return (
            <div className={`rounded-xl border transition-all ${visible ? 'border-blue-200 bg-white shadow-sm' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
                <div className="p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{displayName}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{cat.total} unidades</p>
                    </div>
                    <Switch
                        size="sm"
                        isSelected={visible}
                        onValueChange={() => handleToggleVisibility(productType, cat.id, null, displayName, visible)}
                        isDisabled={savingItem === key}
                        color="success"
                    />
                </div>
                {visible && (
                    <div className="px-3 pb-3">
                        <MarkupControls
                            markupKey={key}
                            productType={productType}
                            categoryId={cat.id}
                            productId={null}
                            displayName={displayName}
                            accentColor="blue"
                        />
                    </div>
                )}
            </div>
        );
    };

    const ProductRow = ({ product, productType }) => {
        const key = getKey(productType, null, product.id);
        const visible = isVisible(productType, null, product.id);
        const displayName = product.name;

        return (
            <div className={`rounded-xl border transition-all ${visible ? 'border-indigo-200 bg-white shadow-sm' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
                <div className="p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{displayName}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">Base: ${product.price?.toLocaleString()}</p>
                    </div>
                    <Switch
                        size="sm"
                        isSelected={visible}
                        onValueChange={() => handleToggleVisibility(productType, null, product.id, displayName, visible)}
                        isDisabled={savingItem === key}
                        color="success"
                    />
                </div>
                {visible && (
                    <div className="px-3 pb-3">
                        <MarkupControls
                            markupKey={key}
                            productType={productType}
                            categoryId={null}
                            productId={product.id}
                            displayName={displayName}
                            accentColor="indigo"
                        />
                    </div>
                )}
            </div>
        );
    };

    const EmptyState = ({ icon: Icon }) => (
        <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Icon size={32} className="mx-auto text-slate-200 mb-2" />
            <p className="text-slate-400 font-semibold text-xs">Sin resultados</p>
        </div>
    );

    if (loadingCategories) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Spinner size="lg" color="primary" label="Sincronizando productos..." labelColor="primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Summary bar - compact horizontal on mobile */}
            <div className="grid grid-cols-4 gap-2 md:gap-3">
                {[
                    { label: 'Perfiles', value: visibleProfiles, icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Cuentas', value: visibleAccounts, icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Combos', value: visibleCombos, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Servicios', value: visibleLicenses, icon: FileKey, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 p-2 md:p-3 bg-white rounded-xl border border-slate-100">
                        <div className={`p-1.5 md:p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon size={16} />
                        </div>
                        <span className="text-lg md:text-xl font-black text-slate-900">{stat.value}</span>
                        <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:block">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Search */}
            <Input
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="flat"
                size="sm"
                classNames={{
                    input: "text-slate-800 font-semibold text-sm",
                    inputWrapper: "bg-white border border-slate-200 rounded-xl h-10"
                }}
                startContent={<Search size={16} className="text-slate-400" />}
                endContent={searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                        <X size={14} />
                    </button>
                )}
            />

            {/* Tabs + Content */}
            <Tabs
                selectedKey={activeTab}
                onSelectionChange={setActiveTab}
                variant="light"
                radius="full"
                size="sm"
                classNames={{
                    tabList: "gap-2 p-2 w-full bg-slate-100 rounded-2xl border border-slate-200/50",
                    cursor: "bg-slate-900 shadow-lg rounded-xl",
                    tab: "h-12 px-2 flex-1 min-w-0",
                    tabContent: "font-bold uppercase text-xs tracking-wide group-data-[selected=true]:text-white text-slate-500"
                }}
            >
                <Tab key="profiles" title="Perfiles">
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        {filteredProfiles.length === 0 ? <EmptyState icon={User} /> : filteredProfiles.map(cat => <CategoryRow key={cat.id} cat={cat} productType="profile" />)}
                    </div>
                </Tab>

                <Tab key="accounts" title="Cuentas">
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        {filteredAccounts.length === 0 ? <EmptyState icon={CreditCard} /> : filteredAccounts.map(cat => <CategoryRow key={cat.id} cat={cat} productType="account" />)}
                    </div>
                </Tab>

                <Tab key="combos" title="Combos">
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        {filteredCombos.length === 0 ? <EmptyState icon={Package} /> : filteredCombos.map(combo => <ProductRow key={combo.id} product={combo} productType="combo" />)}
                    </div>
                </Tab>

                <Tab key="licenses" title="Servicios">
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        {filteredLicenses.length === 0 ? <EmptyState icon={FileKey} /> : filteredLicenses.map(lic => <ProductRow key={lic.id} product={lic} productType="license" />)}
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};

export default KioskMarkupConfig;
