// src/api/brand.api.js
import axios from './axios';

export const brandAPI = {
  // Lấy tất cả thương hiệu (public)
  getAll: async () => {
    const response = await axios.get('/brands');
    return response; // Backend trả về array trực tiếp
  },

  // Tạo thương hiệu mới (admin only)
  create: async (data) => {
    const response = await axios.post('/brands', data);
    return response; // Backend trả về brand object
  },

  // Cập nhật thương hiệu (admin only)
  update: async (id, data) => {
    const response = await axios.put(`/brands/${id}`, data);
    return response; // Backend trả về brand object
  },

  // Xóa thương hiệu (admin only)
  delete: async (id) => {
    const response = await axios.delete(`/brands/${id}`);
    return response; // Backend trả về { message }
  },
};