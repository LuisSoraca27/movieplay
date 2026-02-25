import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import { Badge, Button } from '@heroui/react';
import { toggleCart, fetchCartThunk } from '../../features/cart/cartSlice';
import { useEffect } from 'react';

const CartIcon = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.cart);
    const itemCount = items?.length || 0;

    // Cargar carrito al montar el componente
    useEffect(() => {
        dispatch(fetchCartThunk());
    }, [dispatch]);

    const handleClick = () => {
        dispatch(toggleCart());
    };

    return (
        <Badge
            content={itemCount}
            color="danger"
            shape="circle"
            size="sm"
            isInvisible={itemCount === 0}
            className="translate-x-1 -translate-y-1"
        >
            <Button
                isIconOnly
                variant="light"
                aria-label="Carrito de compras"
                onPress={handleClick}
                className="text-white"
            >
                <ShoppingBag size={22} />
            </Button>
        </Badge>
    );
};

export default CartIcon;
