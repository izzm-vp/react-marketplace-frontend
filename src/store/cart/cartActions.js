import { createAsyncThunk } from "@reduxjs/toolkit";
import apiActions from "../../api/apiActions";

// guest cart
const CART_KEY = 'guest_cart_items';

const getGuestCartItems = () => {
    try {
        const cartItems = localStorage.getItem(CART_KEY);
        return cartItems ? JSON.parse(cartItems) : [];
    } catch (error) {
        console.error('Error getting cart items from localStorage:', error);
        return [];
    }
};

const addToGuestCart = (item) => {
    try {
        const cartItems = getGuestCartItems();
        const existingItemIndex = cartItems.findIndex(
            cartItem =>
                cartItem.product_id === item.product_id &&
                cartItem.size_id === item.size_id &&
                cartItem.color_id === item.color_id
        );

        if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += item.quantity;
            cartItems[existingItemIndex].subtotal = item.price * cartItems[existingItemIndex].quantity;
        } else {
            cartItems.push({
                ...item,
                subtotal: item.price * item.quantity
            });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
        return cartItems;
    } catch (error) {
        console.error('Error adding to guest cart:', error);
        return [];
    }
};

const removeFromGuestCart = (productId, sizeId, colorId) => {
    try {
        let cartItems = getGuestCartItems();
        cartItems = cartItems.filter(
            item =>
                !(item.product_id === productId &&
                    item.size_id === sizeId &&
                    item.color_id === colorId)
        );
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
        return cartItems;
    } catch (error) {
        console.error('Error removing from guest cart:', error);
        return [];
    }
};

const clearGuestCart = () => {
    try {
        localStorage.removeItem(CART_KEY);
        return [];
    } catch (error) {
        console.error('Error clearing guest cart:', error);
        return [];
    }
};


export const addCartItem = createAsyncThunk(
    'cart/addItem',
    async (itemData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (auth.isAuthenticated) {
                const response = await apiActions.addCartItem({
                    user_id: auth.user.id,
                    product_id: itemData.product_id,
                    quantity: itemData.quantity,
                    size_id: itemData.size_id,
                    color_id: itemData.color_id
                });
                return response.data;
            } else {
                const cartItems = addToGuestCart({
                    product_id: itemData.product_id,
                    size_id: itemData.size_id,
                    color_id: itemData.color_id,
                    quantity: itemData.quantity,
                    price: itemData.price
                });
                return cartItems;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addMultipleCartItems = createAsyncThunk(
    'cart/addMultipleItems',
    async (user_id, { rejectWithValue }) => {
        try {
            const guestItems = getGuestCartItems();

            const updatedItems = guestItems.map(item => ({
                ...item,
                user_id: user_id,
            }));


            await apiActions.addMultipleCartItems({ user_id, items: updatedItems });

            clearGuestCart()

            return updatedItems;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/removeItem',
    async ({ itemId, productId, sizeId, colorId }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (auth.isAuthenticated) {
                 await apiActions.removeCartItem(itemId);
                return itemId;
            } else {
                const cartItems = removeFromGuestCart(productId, sizeId, colorId);
                return cartItems;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchUserCart = createAsyncThunk(
    'cart/fetchUserCart',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (auth.isAuthenticated) {
                const response = await apiActions.getUserCart(auth.user.id);
                return response.data;
            } else {
                return getGuestCartItems();
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (auth.isAuthenticated) {
                const response = await apiActions.clearUserCart(auth.user.id);
                return response.data;
            } else {
                clearGuestCart();
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);