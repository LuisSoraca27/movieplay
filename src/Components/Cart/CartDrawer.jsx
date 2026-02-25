import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Trash2, X, Clock, CreditCard, Loader2, Minus, Plus, ArrowRight } from 'lucide-react';
import { Button, Divider, Chip, Badge } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
    closeCart,
    removeFromCartThunk,
    clearCartThunk,
    checkoutThunk,
    clearError,
    clearCheckoutSuccess,
    addToCartThunk,
} from '../../features/cart/cartSlice';

// Mapeo de tipos de producto a nombres amigables
const PRODUCT_TYPE_NAMES = {
    profile: 'Perfil',
    account: 'Cuenta',
    combo: 'Combo',
    license: 'Más Servicios',
    course: 'Curso',
};

const CartDrawer = () => {
    const dispatch = useDispatch();
    const {
        items,
        totalAmount,
        expiresAt,
        isOpen,
        isLoading,
        isCheckingOut,
        error,
        checkoutSuccess,
    } = useSelector((state) => state.cart);

    const { userSession: user } = useSelector((state) => state.user);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const timerRef = useRef(null);

    // Temporizador en tiempo real
    const updateTimer = useCallback(() => {
        if (!expiresAt) {
            setTimeRemaining(null);
            return;
        }

        const now = new Date();
        const expires = new Date(expiresAt);
        const diff = expires - now;

        if (diff <= 0) {
            setTimeRemaining('Expirado');
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        } else {
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
    }, [expiresAt]);

    // Iniciar/detener temporizador
    useEffect(() => {
        if (expiresAt && items.length > 0) {
            updateTimer(); // Actualizar inmediatamente
            timerRef.current = setInterval(updateTimer, 1000);

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
            };
        } else {
            setTimeRemaining(null);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [expiresAt, items.length, updateTimer]);

    // Limpiar timer al desmontar
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const handleRemoveItem = (itemId) => {
        dispatch(removeFromCartThunk(itemId));
    };

    const handleAddQuantity = (item) => {
        dispatch(addToCartThunk({ productType: item.productType, productId: item.productId }));
    };

    const handleClearCart = () => {
        dispatch(clearCartThunk());
    };

    const handleCheckout = () => {
        if (user?.balance < totalAmount) {
            addToast({
                title: 'Saldo insuficiente',
                description: `Necesitas $${totalAmount.toLocaleString()} para completar la compra`,
                color: 'danger',
            });
            return;
        }
        dispatch(checkoutThunk());
    };

    // Mostrar errores
    useEffect(() => {
        if (error) {
            const isSaldoInsuficiente = typeof error === 'string' && error.toLowerCase().includes('saldo') && error.toLowerCase().includes('insuficiente');
            addToast({
                title: isSaldoInsuficiente ? 'Saldo insuficiente' : 'Error',
                description: error,
                color: 'danger',
            });
            dispatch(clearError());
        }
    }, [error, dispatch]);

    // Mostrar éxito del checkout
    useEffect(() => {
        if (checkoutSuccess) {
            addToast({
                title: '¡Compra exitosa!',
                description: `Se procesaron ${checkoutSuccess.orders?.length || 0} productos correctamente.`,
                color: 'success',
            });
            dispatch(clearCheckoutSuccess());
        }
    }, [checkoutSuccess, dispatch]);

    const handleClose = () => {
        dispatch(closeCart());
    };

    const groupedItems = items.reduce((acc, item) => {
        const key = `${item.productType}-${item.productId}`;
        if (!acc[key]) {
            acc[key] = {
                ...item,
                quantity: 1,
                ids: [item.id],
            };
        } else {
            acc[key].quantity += 1;
            acc[key].ids.push(item.id);
        }
        return acc;
    }, {});

    const groupedItemsArray = Object.values(groupedItems);

    return (
        <>
            {/* Overlay with improved blur */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={handleClose}
            />

            {/* Sidebar with premium light theme */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ backgroundColor: '#FFFFFF' }}
            >
                {/* Visual Accent Bar */}
                <div className="h-1 w-full bg-black" />

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 shadow-sm">
                            <ShoppingCart size={22} className="opacity-70" />
                        </div>
                        <div>
                            <span className="text-xl font-black text-gray-900 tracking-tight">Mi Carrito</span>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Orden Interna</p>
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

                {/* Timer: Alert style */}
                {items.length > 0 && timeRemaining && (
                    <div className={`mx-6 mt-6 flex items-center gap-3 px-4 py-3 rounded-2xl border ${timeRemaining === 'Expirado'
                        ? 'bg-red-50 border-red-100 text-red-700'
                        : 'bg-amber-50 border-amber-100 text-amber-700'
                        }`}>
                        <div className={`p-1.5 rounded-lg ${timeRemaining === 'Expirado' ? 'bg-red-100' : 'bg-amber-100'}`}>
                            <Clock size={16} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {timeRemaining === 'Expirado'
                                ? 'La reserva ha expirado'
                                : `Reserva expira en: ${timeRemaining}`
                            }
                        </span>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide" style={{ height: 'calc(100% - 220px)' }}>
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 blur-3xl opacity-20 bg-primary/20 rounded-full" />
                                <ShoppingCart size={80} className="relative text-gray-100" strokeWidth={1} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Tu carrito está vacío</h4>
                            <p className="text-sm text-gray-500 max-w-[220px] leading-relaxed">
                                Agrega productos para comenzar a procesar tus pedidos.
                            </p>
                            <Button
                                variant="bordered"
                                radius="full"
                                className="mt-8 border-gray-200 text-gray-500 font-bold px-8 hover:bg-gray-50 hover:text-gray-900"
                                onPress={handleClose}
                            >
                                Explorar Catálogo
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {groupedItemsArray.map((item) => (
                                <div
                                    key={item.ids[0]}
                                    className="group relative flex items-start gap-4 p-5 bg-gray-50/50 border border-gray-100 rounded-3xl transition-all duration-300 hover:bg-white hover:border-gray-200 hover:shadow-md"
                                >
                                    {/* Item Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border border-gray-100 bg-gray-100 text-gray-500"
                                            >
                                                {PRODUCT_TYPE_NAMES[item.productType] || item.productType}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-base truncate leading-tight mb-1">
                                            {item.productName}
                                        </h4>
                                        <div className="flex items-baseline gap-1.5 mt-2">
                                            <span className="text-xl font-black text-gray-900">
                                                ${(item.price * item.quantity).toLocaleString()}
                                            </span>
                                            {item.quantity > 1 && (
                                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                                                    (${item.price.toLocaleString()} c/u)
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Controls Area */}
                                    <div className="flex flex-col items-end justify-between self-stretch">
                                        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                                            {(item.productType === 'profile' || item.productType === 'account') ? (
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => handleRemoveItem(item.ids[0])}
                                                    isDisabled={isLoading}
                                                    className="h-8 w-8 min-w-8 text-danger/60 hover:text-danger hover:bg-danger/5 rounded-xl"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        onPress={() => handleRemoveItem(item.ids[item.ids.length - 1])}
                                                        isDisabled={isLoading}
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
                                                        onPress={() => handleAddQuantity(item)}
                                                        isDisabled={isLoading}
                                                        className="h-8 w-8 min-w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
                                                    >
                                                        <Plus size={14} />
                                                    </Button>
                                                </>
                                            )}
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
                            {/* Summary Detail */}
                            <div className="space-y-2 opacity-50">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 text-[9px]">Saldo Actual</span>
                                    <span className={`text-xs font-bold ${(user?.balance || 0) >= totalAmount ? 'text-green-600' : 'text-red-600'}`}>
                                        ${(user?.balance || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 text-[9px]">Subtotal Items</span>
                                    <span className="text-xs font-bold text-gray-900">${totalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <Divider className="bg-gray-100" />

                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total a Debitar</span>
                                    <span className="text-3xl font-black text-gray-900 leading-none">
                                        ${totalAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <Chip size="sm" variant="flat" className="bg-gray-100 text-gray-500 font-black text-[9px] uppercase tracking-widest">
                                        {items.length} {items.length === 1 ? 'PRODUCTO' : 'PRODUCTOS'}
                                    </Chip>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                color="success"
                                size="lg"
                                className="w-full h-16 rounded-3xl font-black text-white bg-green-600 hover:bg-green-500 shadow-[0_10px_30px_rgba(22,163,74,0.2)] transition-all duration-300 group overflow-hidden relative"
                                onPress={handleCheckout}
                                isLoading={isCheckingOut}
                                isDisabled={isLoading || isCheckingOut || user?.balance < totalAmount}
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    {!isCheckingOut && <CreditCard size={22} className="group-hover:scale-110 transition-transform duration-300" />}
                                    <span>{isCheckingOut ? 'PROCESANDO...' : 'FINALIZAR COMPRA'}</span>
                                    {!isCheckingOut && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 opacity-60" />}
                                </div>
                            </Button>

                            <Button
                                variant="light"
                                className="text-gray-400 hover:text-danger/60 font-black text-[10px] uppercase tracking-[0.2em] py-2"
                                onPress={handleClearCart}
                                isDisabled={isLoading || isCheckingOut}
                            >
                                Cancelar y Vaciar
                            </Button>
                        </div>

                        {user?.balance < totalAmount && (
                            <p className="text-[10px] font-black text-red-500 text-center mt-4 tracking-widest uppercase animate-pulse">
                                Saldo insuficiente: Falta ${(totalAmount - (user?.balance || 0)).toLocaleString()}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
