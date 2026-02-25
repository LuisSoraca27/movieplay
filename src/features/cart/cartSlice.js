import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dksoluciones from '../../api/config';
import getConfig from '../../utils/config';

// Thunks

/**
 * Obtener carrito activo del usuario
 */
export const fetchCartThunk = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.get('/cart', getConfig());
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener carrito');
        }
    }
);

/**
 * Agregar producto al carrito
 */
export const addToCartThunk = createAsyncThunk(
    'cart/addToCart',
    async ({ productType, productId }, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.post('/cart/add', {
                productType,
                productId
            }, getConfig());
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al agregar al carrito');
        }
    }
);

/**
 * Eliminar item del carrito
 */
export const removeFromCartThunk = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.delete(`/cart/remove/${itemId}`, getConfig());
            return { itemId, totalAmount: response.data.data.totalAmount };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al eliminar del carrito');
        }
    }
);

/**
 * Vaciar carrito
 */
export const clearCartThunk = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            await dksoluciones.delete('/cart/clear', getConfig());
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al vaciar carrito');
        }
    }
);

/**
 * Procesar checkout
 */
export const checkoutThunk = createAsyncThunk(
    'cart/checkout',
    async ({ email } = {}, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.post('/cart/checkout', { email }, getConfig());
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al procesar compra');
        }
    }
);

// Slice
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalAmount: 0,
        expiresAt: null,
        isOpen: false,
        isLoading: false,
        isCheckingOut: false,
        error: null,
        checkoutSuccess: null,
    },
    reducers: {
        openCart: (state) => {
            state.isOpen = true;
        },
        closeCart: (state) => {
            state.isOpen = false;
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearCheckoutSuccess: (state) => {
            state.checkoutSuccess = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCartThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCartThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.items || [];
                state.totalAmount = action.payload.totalAmount || 0;
                state.expiresAt = action.payload.expiresAt;
            })
            .addCase(fetchCartThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Add to Cart
            .addCase(addToCartThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToCartThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.push(action.payload.cartItem);
                state.totalAmount = action.payload.totalAmount;
                state.expiresAt = action.payload.expiresAt;
            })
            .addCase(addToCartThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Remove from Cart
            .addCase(removeFromCartThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromCartThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(item => item.id !== action.payload.itemId);
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(removeFromCartThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Clear Cart
            .addCase(clearCartThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(clearCartThunk.fulfilled, (state) => {
                state.isLoading = false;
                state.items = [];
                state.totalAmount = 0;
                state.expiresAt = null;
            })
            .addCase(clearCartThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Checkout
            .addCase(checkoutThunk.pending, (state) => {
                state.isCheckingOut = true;
                state.error = null;
                state.checkoutSuccess = null;
            })
            .addCase(checkoutThunk.fulfilled, (state, action) => {
                state.isCheckingOut = false;
                state.items = [];
                state.totalAmount = 0;
                state.expiresAt = null;
                state.isOpen = false;
                state.checkoutSuccess = action.payload;
            })
            .addCase(checkoutThunk.rejected, (state, action) => {
                state.isCheckingOut = false;
                state.error = action.payload;
            });
    },
});

export const { openCart, closeCart, toggleCart, clearError, clearCheckoutSuccess } = cartSlice.actions;

export default cartSlice.reducer;
