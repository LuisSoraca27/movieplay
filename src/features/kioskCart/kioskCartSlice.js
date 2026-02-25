import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // [{ id, name, price, quantity, type, categoryId, productId, imageUrl }]
    isOpen: false,
};

const kioskCartSlice = createSlice({
    name: 'kioskCart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const { id, productId, type } = action.payload;
            const existingItem = state.items.find(
                item => (productId && item.productId === productId) || (id && item.id === id)
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeItem: (state, action) => {
            const { productId, id } = action.payload;
            state.items = state.items.filter(
                item => !((productId && item.productId === productId) || (id && item.id === id))
            );
        },
        updateQuantity: (state, action) => {
            const { productId, id, quantity } = action.payload;
            const item = state.items.find(
                item => (productId && item.productId === productId) || (id && item.id === id)
            );
            if (item) {
                item.quantity = Math.max(0, quantity);
                if (item.quantity === 0) {
                    state.items = state.items.filter(i => i !== item);
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        openCart: (state) => {
            state.isOpen = true;
        },
        closeCart: (state) => {
            state.isOpen = false;
        },
    },
});

export const {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart
} = kioskCartSlice.actions;

export default kioskCartSlice.reducer;
