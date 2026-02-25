import React, { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Input, Drawer, DrawerContent, DrawerHeader, DrawerBody } from '@heroui/react';
import { Search, ShoppingBag, X, Menu, User, CreditCard, Package, FileKey } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { openCart } from '../../features/kioskCart/kioskCartSlice';

const WhatsAppIcon = ({ size = 20, className = '' }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const tabIcons = {
    profiles: User,
    accounts: CreditCard,
    combos: Package,
    licenses: FileKey,
};

const KioskNavbar = ({ kiosk, searchTerm, onSearchChange, tabs, activeTab, onTabChange }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.kioskCart?.items || []);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const cartCount = cartItems.length;
    const primaryColor = kiosk?.primaryColor || '#3b82f6';

    const handleTabChange = (tabKey) => {
        onTabChange(tabKey);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <Navbar
                maxWidth="xl"
                className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-zinc-800/50 sticky top-0 z-50 shadow-sm"
                isBordered={false}
                classNames={{
                    wrapper: "px-4 md:px-6 h-16",
                }}
            >
                {/* Left: Menu button (mobile) + Brand */}
                <NavbarContent justify="start" className="gap-2">
                    {/* Mobile Menu Button */}
                    <NavbarItem className="md:hidden">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            onPress={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={22} className="text-gray-700 dark:text-gray-200" />
                        </Button>
                    </NavbarItem>

                    <NavbarBrand className="gap-3 max-w-fit">
                        {kiosk?.logo ? (
                            <img
                                src={kiosk.logo}
                                alt={kiosk.name}
                                className="h-8 object-contain"
                            />
                        ) : (
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md"
                                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${kiosk?.secondaryColor || '#0f172a'})` }}
                            >
                                {kiosk?.name?.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        <p className="font-bold text-gray-900 dark:text-white text-base hidden sm:block">{kiosk?.name}</p>
                    </NavbarBrand>
                </NavbarContent>

                {/* Center: Search (Desktop) */}
                <NavbarContent justify="center" className="hidden md:flex flex-grow max-w-md">
                    <div className="w-full">
                        <Input
                            classNames={{
                                base: "h-10",
                                inputWrapper: "h-10 bg-gray-100/80 dark:bg-zinc-800/80 border-0 hover:bg-gray-100 dark:hover:bg-zinc-800 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 shadow-sm",
                                input: "text-sm placeholder:text-gray-400",
                            }}
                            placeholder="Buscar productos..."
                            size="sm"
                            radius="full"
                            startContent={<Search size={18} className="text-gray-400" />}
                            endContent={
                                searchTerm && (
                                    <button onClick={() => onSearchChange('')} className="text-gray-400 hover:text-gray-600">
                                        <X size={16} />
                                    </button>
                                )
                            }
                            type="search"
                            value={searchTerm}
                            onValueChange={onSearchChange}
                        />
                    </div>
                </NavbarContent>

                {/* Right: Tabs (desktop) + Cart */}
                <NavbarContent justify="end" className="gap-1">
                    {/* Category Tabs - Desktop only */}
                    {tabs && tabs.length > 0 && (
                        <div className="hidden md:flex items-center gap-1 mr-2">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => onTabChange(tab.key)}
                                        style={isActive ? {
                                            backgroundColor: primaryColor,
                                            boxShadow: `0 4px 12px -2px ${primaryColor}40`
                                        } : {}}
                                        className={`
                                            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300
                                            ${isActive
                                                ? 'text-white'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                            }
                                        `}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            style={isActive ? { backgroundColor: 'rgba(255,255,255,0.2)' } : {}}
                                            className={`
                                                px-1.5 py-0.5 rounded-full text-xs font-bold
                                                ${isActive
                                                    ? 'text-white'
                                                    : 'bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-400'
                                                }
                                            `}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Mobile Search Toggle */}
                    <NavbarItem className="md:hidden">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            onPress={() => setShowMobileSearch(!showMobileSearch)}
                        >
                            <Search size={20} className="text-gray-600 dark:text-gray-300" />
                        </Button>
                    </NavbarItem>

                    {/* Cart */}
                    <NavbarItem className="overflow-visible">
                        <div
                            onClick={() => dispatch(openCart())}
                            className="relative cursor-pointer p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center"
                        >
                            <ShoppingBag size={24} style={{ color: primaryColor }} />
                            {cartCount > 0 && (
                                <span
                                    className="absolute top-1 right-1 w-4.5 h-4.5 text-white text-[9px] font-black rounded-full flex items-center justify-center z-10"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </div>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            {/* Mobile Search Bar */}
            {showMobileSearch && (
                <div className="md:hidden sticky top-16 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl px-4 py-3 border-b border-gray-100 dark:border-zinc-800 shadow-sm">
                    <Input
                        classNames={{
                            inputWrapper: "bg-gray-100 dark:bg-zinc-800",
                        }}
                        placeholder="Buscar productos..."
                        size="sm"
                        radius="full"
                        startContent={<Search size={18} className="text-gray-400" />}
                        endContent={
                            <button onClick={() => { onSearchChange(''); setShowMobileSearch(false); }} className="text-gray-400">
                                <X size={16} />
                            </button>
                        }
                        type="search"
                        value={searchTerm}
                        onValueChange={onSearchChange}
                        autoFocus
                    />
                </div>
            )}

            {/* Mobile Menu Drawer */}
            <Drawer
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                placement="left"
                size="xs"
                style={{ backgroundColor: '#FFFFFF' }}
                classNames={{
                    base: "shadow-2xl",
                    header: "border-b border-gray-100",
                    body: "p-0",
                    closeButton: "text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all",
                }}
            >
                <DrawerContent>
                    <DrawerHeader className="flex items-center gap-4 px-6 py-8">
                        {kiosk?.logo ? (
                            <div className="p-1 rounded-2xl border border-gray-100 bg-white shadow-sm">
                                <img
                                    src={kiosk.logo}
                                    alt={kiosk.name}
                                    className="h-10 w-10 object-contain rounded-xl"
                                />
                            </div>
                        ) : (
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg"
                                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${kiosk?.secondaryColor || '#0f172a'})` }}
                            >
                                {kiosk?.name?.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="font-black text-gray-900 text-lg tracking-tight leading-none">{kiosk?.name}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <div
                                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{ backgroundColor: kiosk?.primaryColor || '#6366f1' }}
                                />
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tienda Oficial</p>
                            </div>
                        </div>
                    </DrawerHeader>
                    <DrawerBody className="flex flex-col">
                        {/* Categories Section */}
                        <div className="flex-1 px-6 py-6 overflow-y-auto scrollbar-hide">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-1 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Nuestras Categorías
                                </p>
                            </div>

                            <div className="space-y-3">
                                {tabs && tabs.map((tab) => {
                                    const isActive = activeTab === tab.key;
                                    const Icon = tabIcons[tab.key] || Package;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => handleTabChange(tab.key)}
                                            className={`
                                                w-full flex items-center gap-4 px-4 py-4 rounded-3xl text-left transition-all duration-300 group
                                                ${isActive
                                                    ? `bg-gray-50 border border-gray-100`
                                                    : 'hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <div
                                                className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'text-white shadow-lg scale-110' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'}`}
                                                style={isActive ? { backgroundColor: primaryColor, boxShadow: `0 8px 20px -5px ${primaryColor}40` } : {}}
                                            >
                                                <Icon size={20} />
                                            </div>

                                            <div className="flex-1">
                                                <span className={`
                                                    block text-sm font-black tracking-tight leading-none
                                                    ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}
                                                `}>
                                                    {tab.label}
                                                </span>
                                                <span className={`
                                                    text-[9px] font-bold uppercase tracking-wider mt-1 block
                                                    ${isActive ? `opacity-70` : 'text-gray-300'}
                                                `}
                                                    style={isActive ? { color: primaryColor } : {}}
                                                >
                                                    Ver productos
                                                </span>
                                            </div>

                                            <div
                                                className={`
                                                    min-w-[28px] h-7 rounded-xl flex items-center justify-center text-[10px] font-black transition-colors
                                                    ${isActive
                                                        ? 'bg-gray-100'
                                                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}
                                                `}
                                                style={isActive ? { color: primaryColor } : {}}
                                            >
                                                {tab.count}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                            {kiosk?.whatsappNumber && (
                                <a
                                    href={`https://wa.me/${kiosk.whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-3xl transition-all duration-300 hover:shadow-md hover:border-gray-200 group"
                                >
                                    <div className="bg-green-500 text-white p-2.5 rounded-2xl shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                                        <WhatsAppIcon size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-900">Ayuda y Soporte</span>
                                        <span className="text-[10px] font-bold text-gray-400">WhatsApp 24/7</span>
                                    </div>
                                </a>
                            )}

                            <p className="mt-6 text-center text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                                &copy; {new Date().getFullYear()} {kiosk?.name}
                            </p>
                        </div>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default KioskNavbar;
