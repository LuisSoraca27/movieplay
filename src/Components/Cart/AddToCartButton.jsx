import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Check } from 'lucide-react';
import { Button, Tooltip } from '@heroui/react';
import { addToast } from "@heroui/toast";
import { addToCartThunk, openCart } from '../../features/cart/cartSlice';

/**
 * Botón reutilizable para agregar productos al carrito
 * @param {Object} props
 * @param {'profile' | 'account' | 'combo' | 'license' | 'course'} props.productType - Tipo de producto
 * @param {string} props.productId - ID del producto
 * @param {string} props.productName - Nombre del producto (para mensajes)
 * @param {boolean} [props.disabled] - Si el botón está deshabilitado
 * @param {string} [props.size] - Tamaño del botón: 'sm' | 'md' | 'lg'
 * @param {boolean} [props.iconOnly] - Si solo mostrar el icono
 */
const AddToCartButton = ({
    productType,
    productId,
    productName,
    disabled = false,
    size = 'md',
    iconOnly = false,
    onSuccess,
}) => {
    const dispatch = useDispatch();
    const { items, isLoading } = useSelector((state) => state.cart);

    // Verificar si ya está en el carrito
    const isInCart = items?.some(
        (item) => item.productId === productId && item.status === 'reserved'
    );

    const handleAddToCart = async () => {
        if (isInCart) {
            dispatch(openCart());
            return;
        }

        try {
            const result = await dispatch(addToCartThunk({ productType, productId })).unwrap();
            addToast({ title: 'Éxito', description: `${productName || 'Producto'} agregado al carrito`, color: 'success' });
            dispatch(openCart());
            if (onSuccess) onSuccess();
        } catch (error) {
            addToast({ title: 'Error', description: error || 'Error al agregar al carrito', color: 'danger' });
        }
    };

    if (iconOnly) {
        return (
            <Tooltip content={isInCart ? 'Ya en carrito' : 'Agregar al carrito'}>
                <Button
                    isIconOnly
                    onPress={handleAddToCart}
                    isDisabled={disabled || isLoading}
                    isLoading={isLoading}
                    className={
                        isInCart
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 h-12 w-12 rounded-2xl transition-all'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 h-12 w-12 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all'
                    }
                >
                    {isInCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                </Button>
            </Tooltip>
        );
    }

    return (
        <Button
            onPress={handleAddToCart}
            isDisabled={disabled || isLoading}
            isLoading={isLoading}
            startContent={isInCart ? <Check size={18} /> : <ShoppingCart size={18} />}
            className={
                isInCart
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[11px] h-12 rounded-2xl transition-all px-6'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest text-[11px] h-12 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all px-6'
            }
        >
            {isInCart ? 'En carrito' : 'Agregar al carrito'}
        </Button>
    );
};

export default AddToCartButton;
