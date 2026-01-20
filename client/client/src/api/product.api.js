// src/api/product.api.js
import axios from './axios';

export const productAPI = {
  // Lấy tất cả sản phẩm (public)
  getAll: async (params) => {
    const response = await axios.get('/products', { params });
    return response; // Backend trả về array trực tiếp
  },

  // Lấy chi tiết 1 sản phẩm (public)
  getById: async (id) => {
    const response = await axios.get(`/products/${id}`);
    return response; // Backend trả về object trực tiếp
  },

  // Tạo sản phẩm mới (admin only)
  create: async (data) => {
    const response = await axios.post('/products', data);
    return response; // Backend trả về product object
  },

  // Cập nhật sản phẩm (admin only)
  update: async (id, data) => {
    const response = await axios.put(`/products/${id}`, data);
    return response; // Backend trả về product object
  },

  // Xóa sản phẩm (admin only)
  delete: async (id) => {
    const response = await axios.delete(`/products/${id}`);
    return response; // Backend trả về { message }
  },
};