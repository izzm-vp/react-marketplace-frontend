import axiosClient from "./axiosClient";

const apiActions = {
    // AUTH  
    login: (credentials) => axiosClient.post("/api/login", credentials),
    logout: () => axiosClient.post("/api/logout"),
    verify: (token) => axiosClient.post("/api/verify-email", token),
    register: (userData) => axiosClient.post("/api/register", userData),
    fetchUser: () => axiosClient.post("/api/me"),

    // PRODUCTS
    fetchProducts: (params) => axiosClient.get("/api/product/all", { params }),
    searchProducts: (params) => axiosClient.get("/api/product/search", { params }),
    fetchProductsByCategory: (categoryId, params) =>
        axiosClient.get(`/api/product/category/${categoryId}`, { params }),
    fetchProduct: (id) => axiosClient.get(`/api/product/${id}`),
    createProduct: (productData) => axiosClient.post("/api/product/save", productData),
    updateProduct: (id, productData) => axiosClient.put(`/api/product/update/${id}`, productData),
    deleteProduct: (id) => axiosClient.delete(`/api/product/delete/${id}`),

    // CART
    addCartItem: (cartData) => axiosClient.post("/api/cart/save", cartData),
    addMultipleCartItems: (itemsData) => axiosClient.post("/api/cart/items", itemsData),
    removeCartItem: (id) => axiosClient.delete(`/api/cart/item/${id}`),
    clearUserCart: (userId) => axiosClient.delete(`/api/cart/clear/${userId}`),
    getUserCart: (userId) => axiosClient.get(`/api/cart/user/${userId}`)
};

export default apiActions;