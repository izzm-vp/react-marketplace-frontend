import { createAsyncThunk } from "@reduxjs/toolkit";
import apiActions from "../../api/apiActions";


export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const  response  = await apiActions.fetchProducts(params);

            return response.data;


        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);


export const searchProducts = createAsyncThunk(
    'products/search',
    async (searchParams, { rejectWithValue }) => {
        try {
            const response = await apiActions.searchProducts(searchParams);
            return response.data;
        } catch (error) {
            if (error.response?.status === 400) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue('Failed to search products');
        }
    }
);


export const fetchProductsByCategory = createAsyncThunk(
    'products/byCategory',
    async ({ categoryId, ...params }, { rejectWithValue }) => {
        try {
            const response = await apiActions.fetchProductsByCategory(categoryId, params);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch products by category');
        }
    }
);



export const createProduct = createAsyncThunk(
    'products/create',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await apiActions.createProduct(productData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 400) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue('Failed to create product');
        }
    }
);


export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, ...productData }, { rejectWithValue }) => {
        try {
            const response = await apiActions.updateProduct(id, productData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return rejectWithValue('Product not found');
            }
            if (error.response?.status === 400) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue('Failed to update product');
        }
    }
);


export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id, { rejectWithValue }) => {
        try {
            await apiActions.deleteProduct(id);
            return id;
        } catch (error) {
            if (error.response?.status === 404) {
                return rejectWithValue('Product not found');
            }
            return rejectWithValue('Failed to delete product');
        }
    }
);

