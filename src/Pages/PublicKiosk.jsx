import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicKiosk, fetchKioskProducts, resetPublicKiosk } from '../features/kiosk/kioskSlice';
import { addItem, openCart } from '../features/kioskCart/kioskCartSlice';
import { getKioskSlug } from '../utils/domain';
import { getCategoryImage, getCategoryBackground } from '../utils/categoryImages';
import '../style/cardprofile.css';
import KioskHeader from '../Components/Kiosk/KioskHeader';
import KioskNavbar from '../Components/Kiosk/KioskNavbar';
import KioskFooter from '../Components/Kiosk/KioskFooter';
import KioskCategoryCard from '../Components/Kiosk/KioskCategoryCard';
import KioskProductCard from '../Components/Kiosk/KioskProductCard';
import { KioskCartDrawer } from '../Components/Cart';
import { Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Divider } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Store, Package, MessageCircle, User, CreditCard, FileKey, ShoppingBag, Info, CheckCircle2 } from 'lucide-react';
import { selectCategoriesCPs } from '../utils/functions/selectNameCategoryOptions';

const PublicKiosk = () => {
    const { slug: paramSlug } = useParams();
    const domainSlug = getKioskSlug();
    const slug = paramSlug || domainSlug;

    const dispatch = useDispatch();
    const { publicKiosk: kiosk, products, isLoading, error } = useSelector((state) => state.kiosk);
    const { items: cartItems } = useSelector((state) => state.kioskCart || { items: [] });

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profiles');
    const [searchTerm, setSearchTerm] = useState('');
    const [addingToCartId, setAddingToCartId] = useState(null);

    useEffect(() => {
        if (slug) {
            dispatch(fetchPublicKiosk(slug));
            dispatch(fetchKioskProducts({ slug }));
        }
        return () => {
            dispatch(resetPublicKiosk());
        };
    }, [dispatch, slug]);

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
        if (!products) return {};
        const lowerTerm = searchTerm.toLowerCase();

        const filterList = (list) => list?.filter(item =>
            (item.name || '').toLowerCase().includes(lowerTerm) ||
            (item.description || '').toLowerCase().includes(lowerTerm) ||
            (item.categoryName || '').toLowerCase().includes(lowerTerm)
        ) || [];

        return {
            profiles: filterList(products.profiles),
            accounts: filterList(products.accounts),
            combos: filterList(products.combos),
            licenses: filterList(products.licenses),
        };
    }, [products, searchTerm]);

    // Set first available tab
    useEffect(() => {
        if (!isLoading && filteredProducts) {
            // Only change tab if current one is empty/invalid? 
            // Better to stay on current tab unless it disappears, but for search it's okay to stay.
            // Just initial load:
            if (!searchTerm && products) {
                if (products.profiles?.length > 0) setActiveTab('profiles');
                else if (products.accounts?.length > 0) setActiveTab('accounts');
                else if (products.combos?.length > 0) setActiveTab('combos');
                else if (products.licenses?.length > 0) setActiveTab('licenses');
            }
        }
    }, [isLoading, products]); // Removing filteredProducts dependencies to avoid auto-switching tabs on search

    const handleCardClick = (item, type) => {
        if (!item) return;

        if (type === 'profile' || type === 'account') {
            if (parseInt(item.total || 0) > 0) {
                setSelectedItem({ ...item, itemType: type });
                setIsModalOpen(true);
            }
        } else {
            setSelectedItem({ ...item, itemType: type });
            setIsModalOpen(true);
        }
    };

    const handleAddToCart = (e, item, type) => {
        if (e && e.stopPropagation) e.stopPropagation();

        let productName = item.name;
        if (type === 'profile' || type === 'account') {
            const [, displayName] = getCategoryImage(item.categoryName);
            productName = displayName;
        }

        dispatch(addItem({
            id: item.id || item.categoryId,
            productId: item.productId,
            name: productName,
            price: item.finalPrice,
            type: type,
            imageUrl: item.image || ''
        }));

        addToast({
            title: 'Agregado al carrito',
            description: `${productName} se agregó correctamente`,
            color: 'success',
        });

        dispatch(openCart());
        setIsModalOpen(false);
    };

    const handleContactWhatsApp = () => {
        if (kiosk?.whatsappNumber && selectedItem) {
            let productName, productTypeText;

            if (selectedItem.itemType === 'profile' || selectedItem.itemType === 'account') {
                const [, displayName] = getCategoryImage(selectedItem.categoryName);
                productName = displayName;
                productTypeText = selectedItem.itemType === 'profile' ? 'Perfil' : 'Cuenta';
            } else {
                productName = selectedItem.name;
                productTypeText = selectedItem.itemType === 'combo' ? 'Combo' : 'Más Servicios';
            }

            const message = `¡Hola! 👋\n\nMe interesa comprar:\n📦 *${productName}* (${productTypeText})\n💰 Precio: $${selectedItem.finalPrice?.toLocaleString()}\n${selectedItem.total ? `📊 Disponibles: ${selectedItem.total}` : ''}\n\nLo vi en tu tienda *${kiosk.name}*.\n¿Está disponible?`;
            const url = `https://wa.me/${kiosk.whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        }
        setIsModalOpen(false);
    };

    if (isLoading && !kiosk) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    if (error || !kiosk) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
                <Store className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Tienda no encontrada</h2>
                <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
                    No pudimos encontrar la tienda que buscas. Verifica la dirección URL o intenta nuevamente.
                </p>
            </div>
        );
    }

    // Grid component
    const ItemsGrid = ({ items, type, emptyMessage }) => {
        if (!items || items.length === 0) {
            return (
                <div className="w-full text-center py-16 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Package className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">{emptyMessage}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Intenta con otra búsqueda</p>
                </div>
            );
        }

        const isCategory = type === 'profile' || type === 'account';

        return (
            <div className="flex flex-wrap justify-center py-6">
                {items.map((item, index) => {
                    const itemId = item.categoryId || item.productId || item.id || index;
                    const isAdding = addingToCartId === itemId;

                    return isCategory ? (
                        <KioskCategoryCard
                            key={`${type}-${itemId}`}
                            item={item}
                            type={type}
                            onCardClick={handleCardClick}
                            onAddToCart={handleAddToCart}
                            isAdding={isAdding}
                        />
                    ) : (
                        <KioskProductCard
                            key={`${type}-${itemId}`}
                            item={item}
                            type={type}
                            onCardClick={handleCardClick}
                            onAddToCart={handleAddToCart}
                            isAdding={isAdding}
                        />
                    );
                })}
            </div>
        );
    };

    const profilesCount = filteredProducts.profiles?.length || 0;
    const accountsCount = filteredProducts.accounts?.length || 0;
    const combosCount = filteredProducts.combos?.length || 0;
    const licensesCount = filteredProducts.licenses?.length || 0;
    const totalProducts = profilesCount + accountsCount + combosCount + licensesCount;

    // Get available tabs
    const availableTabs = [];
    if (products?.profiles?.length > 0) availableTabs.push({ key: 'profiles', label: 'Perfiles', icon: User, count: profilesCount, color: 'primary' });
    if (products?.accounts?.length > 0) availableTabs.push({ key: 'accounts', label: 'Cuentas', icon: CreditCard, count: accountsCount, color: 'secondary' });
    if (products?.combos?.length > 0) availableTabs.push({ key: 'combos', label: 'Combos', icon: Package, count: combosCount, color: 'secondary' });
    if (products?.licenses?.length > 0) availableTabs.push({ key: 'licenses', label: 'Más Servicios', icon: FileKey, count: licensesCount, color: 'warning' });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 selection:bg-primary-100">
            <KioskNavbar
                kiosk={kiosk}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                tabs={availableTabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <KioskHeader kiosk={kiosk} />

            <KioskCartDrawer kiosk={kiosk} />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Spinner size="lg" color="primary" />
                        <p className="mt-4 text-gray-500 animate-pulse">Cargando productos...</p>
                    </div>
                )}

                {/* Products Grid */}
                {!isLoading && (
                    <div className="min-h-[500px]">
                        {activeTab && filteredProducts[activeTab] ? (
                            <ItemsGrid
                                items={filteredProducts[activeTab]}
                                type={activeTab.slice(0, -1)}
                                emptyMessage={searchTerm ? `No se encontraron resultados para "${searchTerm}"` : `No hay ${activeTab === 'profiles' ? 'perfiles' : activeTab === 'accounts' ? 'cuentas' : activeTab === 'combos' ? 'combos' : 'servicios'} disponibles`}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                    <Store className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                    Selecciona una categoría para ver los productos
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Purchase/Details Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="3xl" scrollBehavior="inside">
                <ModalContent>
                    {selectedItem && (
                        <>
                            <ModalHeader className="flex flex-col gap-1 border-b border-gray-100 dark:border-zinc-700">
                                <h3 className="text-xl font-bold">Detalles del Producto</h3>
                            </ModalHeader>
                            <ModalBody className="py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Image/Visual */}
                                    <div className="flex flex-col items-center justify-center min-h-[250px]">
                                        {(() => {
                                            if (selectedItem.itemType === 'profile' || selectedItem.itemType === 'account') {
                                                const [img, displayName] = getCategoryImage(selectedItem.categoryName);
                                                const backgroundClass = getCategoryBackground(selectedItem.categoryName);
                                                return (
                                                    <div className={`card-profile ${backgroundClass} scale-90 pointer-events-none`}>
                                                        <div className="container-eyelash">
                                                            <div className="eyelash-circle"></div>
                                                            <div className="eyelash"></div>
                                                        </div>
                                                        {img && (
                                                            <img
                                                                src={img}
                                                                alt={displayName}
                                                                className="object-contain"
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            } else if (selectedItem.image) {
                                                return (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <img
                                                            src={selectedItem.image}
                                                            alt={selectedItem.name}
                                                            className="w-full h-auto max-h-[380px] object-contain transition-transform duration-500 hover:scale-105"
                                                        />
                                                    </div>
                                                );
                                            } else {
                                                const Icon = selectedItem.itemType === 'combo' ? Package : FileKey;
                                                return (
                                                    <div className="p-8 bg-primary-100 dark:bg-primary-900/40 rounded-full">
                                                        <Icon size={100} className="text-primary" />
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>

                                    {/* Right Column: Information */}
                                    <div className="flex flex-col gap-6">
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-3">
                                                {selectedItem.name || selectedItem.categoryName || 'Sin nombre'}
                                            </h2>
                                            <div className="flex flex-wrap gap-2">
                                                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-wider uppercase">
                                                    {selectedItem.itemType === 'profile' ? 'PERFIL' :
                                                        selectedItem.itemType === 'account' ? 'CUENTA' :
                                                            selectedItem.itemType === 'combo' ? 'COMBO' : 'MÁS SERVICIOS'}
                                                </div>
                                                {selectedItem.total !== undefined && (
                                                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wider flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        {selectedItem.total} DISPONIBLES
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {selectedItem.description && (
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Descripción</h4>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                    {selectedItem.description}
                                                </p>
                                            </div>
                                        )}

                                        {selectedItem.itemType === 'combo' && selectedItem.categoriesCPs && (
                                            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-zinc-700/50">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 size={16} className="text-primary" />
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        Contenido Incluido
                                                    </h4>
                                                </div>
                                                {(() => {
                                                    const { categoriesProfile, categoriesAccount } = selectCategoriesCPs(selectedItem.categoriesCPs);
                                                    return (
                                                        <div className="flex flex-wrap gap-2">
                                                            {categoriesProfile.map((cat, idx) => (
                                                                <Chip key={`p-${idx}`} size="sm" variant="flat" color="primary" className="px-2">Perfil {cat.name}</Chip>
                                                            ))}
                                                            {categoriesAccount.map((cat, idx) => (
                                                                <Chip key={`a-${idx}`} size="sm" variant="flat" color="secondary" className="px-2">Cuenta {cat.name}</Chip>
                                                            ))}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-6">
                                            <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 flex justify-between items-center">
                                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Precio</span>
                                                <span className="text-3xl font-black text-primary">
                                                    ${(selectedItem.price || selectedItem.finalPrice || 0).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="border-t border-gray-100 dark:border-zinc-800 p-4 flex flex-row gap-3">
                                {kiosk?.whatsappNumber && (
                                    <Button
                                        isIconOnly
                                        variant="flat"
                                        size="md"
                                        radius="lg"
                                        className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                        onPress={handleContactWhatsApp}
                                        aria-label="Contactar por WhatsApp"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03c0 2.122.547 4.192 1.586 6.03l-1.685 6.155 6.305-1.652A11.726 11.726 0 0012.048 24c6.632 0 12.03-5.392 12.034-12.03a11.76 11.76 0 00-3.417-8.412z" />
                                        </svg>
                                    </Button>
                                )}
                                <Button
                                    color="primary"
                                    size="md"
                                    radius="lg"
                                    className="flex-1 font-bold text-white shadow-lg shadow-primary/20 bg-primary-500"
                                    onPress={(e) => handleAddToCart(e, selectedItem, selectedItem.itemType)}
                                    startContent={<ShoppingBag size={18} />}
                                >
                                    Agregar al Carrito
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Footer */}
            <KioskFooter kiosk={kiosk} />
        </div>
    );
};

export default PublicKiosk;
