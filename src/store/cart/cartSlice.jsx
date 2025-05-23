import { createSlice } from '@reduxjs/toolkit';
import {
    addCartItem,
    addMultipleCartItems,
    removeCartItem,
    fetchUserCart,
    clearCart
} from './cartActions';

const initialState = {
    items: [],
    status: 'idle',
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCart: (state) => {
            return initialState;
        }

    },
    extraReducers: (builder) => {
        builder
            // Ajouter un article au panier
            .addCase(addCartItem.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addCartItem.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = [...state.items, action.payload];
            })
            .addCase(addCartItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Ajouter plusieurs articles au panier
            .addCase(addMultipleCartItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addMultipleCartItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(addMultipleCartItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Supprimer un article du panier
            .addCase(removeCartItem.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Récupérer le panier de l'utilisateur
            .addCase(fetchUserCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchUserCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Vider le panier
            .addCase(clearCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.status = 'succeeded';
                state.items = [];
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
