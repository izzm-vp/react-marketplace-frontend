import { createSlice } from '@reduxjs/toolkit';
import {
    fetchProducts,
    searchProducts,
    fetchProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct
} from './productActions';

const initialState = {
    products: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        totalPages: 1,
        totalItems: 0,
    },
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearCurrentProduct(state) {
            state.currentProduct = null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all products
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.items || action.payload;
                if (action.payload.pagination) {
                    state.pagination = {
                        page: action.payload.pagination.page,
                        totalPages: action.payload.pagination.totalPages,
                        totalItems: action.payload.pagination.totalItems,
                    };
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Search products
        builder
            .addCase(searchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.items || action.payload;
                if (action.payload.pagination) {
                    state.pagination = {
                        page: action.payload.pagination.page,
                        totalPages: action.payload.pagination.totalPages,
                        totalItems: action.payload.pagination.totalItems,
                    };
                }
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch products by category
        builder
            .addCase(fetchProductsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.items || action.payload;
                if (action.payload.pagination) {
                    state.pagination = {
                        page: action.payload.pagination.page,
                        totalPages: action.payload.pagination.totalPages,
                        totalItems: action.payload.pagination.totalItems,
                    };
                }
            })
            .addCase(fetchProductsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create product
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.unshift(action.payload);
                state.currentProduct = action.payload;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update product
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                state.currentProduct = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete product
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(product => product.id !== action.payload);
                if (state.currentProduct?.id === action.payload) {
                    state.currentProduct = null;
                }
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;

export default productSlice.reducer;