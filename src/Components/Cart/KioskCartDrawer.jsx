import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Trash2, X, MessageCircle, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button, Divider, Chip } from '@heroui/react';
import {
    closeCart,
    removeItem,
    clearCart,
    updateQuantity,
} from '../../features/kioskCart/kioskCartSlice';

const PRODUCT_TYPE_NAMES = {
    profile: 'Perfil',
    account: 'Cuenta',
    combo: 'Combo',
    license: 'Más Servicios',
};

const KioskCartDrawer = ({ kiosk }) => {
    const dispatch = useDispatch();
    const { items, isOpen } = useSelector((state) => state.kioskCart);

    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleClose = () => {
        dispatch(closeCart());
    };

    const handleUpdateQuantity = (item, delta) => {
        dispatch(updateQuantity({
            productId: item.productId,
            id: item.id,
            quantity: item.quantity + delta
        }));
    };

    const handleRemoveItem = (item) => {
        dispatch(removeItem({ productId: item.productId, id: item.id }));
    };

    const handleWhatsAppCheckout = () => {
        if (!kiosk?.whatsappNumber) return;

        let message = `¡Hola! 👋 Vengo de tu tienda *${kiosk.name}*.\n\n`;
        message += `Me gustaría realizar el siguiente pedido:\n\n`;

        items.forEach((item) => {
            const typeName = PRODUCT_TYPE_NAMES[item.type] || item.type;
            message += `🔹 *${item.name}* (${typeName})\n`;
            message += `   ${item.quantity} x $${item.price.toLocaleString()} = *$${(item.price * item.quantity).toLocaleString()}*\n\n`;
        });

        message += `──────────────\n`;
        message += `💰 *Total a pagar: $${totalAmount.toLocaleString()}*`;

        const url = `https://wa.me/${kiosk.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <>
            {/* Overlay with improved blur */}
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[9998] transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={handleClose}
            />

            {/* Sidebar with premium light theme */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md shadow-2xl z-[9999] transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ backgroundColor: '#FFFFFF' }}
            >
                {/* Visual Accent Bar */}
                <div className="h-1 w-full flex">
                    <div style={{ backgroundColor: kiosk?.primaryColor || '#6366f1' }} className="flex-1" />
                    <div style={{ backgroundColor: kiosk?.secondaryColor || '#0f172a' }} className="flex-1" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 shadow-sm">
                            <ShoppingCart size={22} className="opacity-70" />
                        </div>
                        <div>
                            <span className="text-xl font-black text-gray-900 tracking-tight">Tu Pedido</span>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Shopping Cart</p>
                        </div>
                    </div>

                    <Button
                        isIconOnly
                        variant="light"
                        onPress={handleClose}
                        className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all rounded-full"
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide" style={{ height: 'calc(100% - 140px)' }}>
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 blur-3xl opacity-20 bg-primary/20 rounded-full" />
                                <ShoppingBag size={80} className="relative text-gray-100" strokeWidth={1} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Tu carrito está vacío</h4>
                            <p className="text-sm text-gray-500 max-w-[220px] leading-relaxed">
                                Parece que aún no has añadido nada a tu selección personal.
                            </p>
                            <Button
                                variant="bordered"
                                radius="full"
                                className="mt-8 border-gray-200 text-gray-500 font-bold px-8 hover:bg-gray-50 hover:text-gray-900"
                                onPress={handleClose}
                            >
                                Seguir comprando
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={`${item.type}-${item.productId || item.id}`}
                                    className="group relative flex items-start gap-4 p-5 bg-gray-50/50 border border-gray-100 rounded-3xl transition-all duration-300 hover:bg-white hover:border-gray-200 hover:shadow-md"
                                >
                                    {/* Item Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border border-gray-100 bg-gray-100 text-gray-500"
                                            >
                                                {PRODUCT_TYPE_NAMES[item.type] || item.type}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-base truncate leading-tight mb-1">
                                            {item.name}
                                        </h4>
                                        <div className="flex items-baseline gap-1.5 mt-2">
                                            <span className="text-xl font-black text-gray-900">
                                                ${item.price.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">Unit</span>
                                        </div>
                                    </div>

                                    {/* Controls Area */}
                                    <div className="flex flex-col items-end justify-between self-stretch">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            className="text-gray-300 hover:text-danger hover:bg-danger/5 -mt-2 -mr-2 rounded-full"
                                            onPress={() => handleRemoveItem(item)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>

                                        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() => handleUpdateQuantity(item, -1)}
                                                className="h-8 w-8 min-w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
                                            >
                                                {item.quantity === 1 ? <Trash2 size={14} className="text-danger/60" /> : <Minus size={14} />}
                                            </Button>
                                            <span className="w-6 text-center text-sm font-black text-gray-900">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() => handleUpdateQuantity(item, 1)}
                                                className="h-8 w-8 min-w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
                                            >
                                                <Plus size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Section: Final Checkout */}
                {items.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-gray-100 bg-white/80 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center opacity-40">
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Subtotal</span>
                                <span className="text-sm font-bold text-gray-900">${totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total a Pagar</span>
                                    <span className="text-3xl font-black text-gray-900 leading-none">
                                        ${totalAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <Chip size="sm" variant="flat" className="bg-gray-100 text-gray-500 font-black text-[9px] uppercase tracking-widest">
                                        {items.length} {items.length === 1 ? 'ARTÍCULO' : 'ARTÍCULOS'}
                                    </Chip>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                color="success"
                                size="lg"
                                className="w-full h-16 rounded-3xl font-black text-white bg-green-600 hover:bg-green-500 shadow-[0_10px_30px_rgba(22,163,74,0.2)] transition-all duration-300 group overflow-hidden relative"
                                onPress={handleWhatsAppCheckout}
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    <WhatsAppIcon size={22} className="group-hover:scale-110 transition-transform duration-300" />
                                    <span>REALIZAR PEDIDO</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 opacity-60" />
                                </div>
                            </Button>

                            <Button
                                variant="light"
                                className="text-gray-400 hover:text-danger/60 font-black text-[10px] uppercase tracking-[0.2em] py-2"
                                onPress={() => dispatch(clearCart())}
                            >
                                Vaciar mi selección
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

// Internal WhatsApp Icon for consistency
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

export default KioskCartDrawer;
