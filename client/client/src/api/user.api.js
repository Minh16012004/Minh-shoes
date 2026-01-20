// src/api/user.api.js
import axios from './axios';

export const userAPI = {
  // Lấy tất cả users (admin only) - sử dụng authAPI thay vì
  getAll: async () => {
    const response = await axios.get('/auth/users');
    return response.data;
  },

  // Cập nhật user (admin only)
  update: async (id, data) => {
    const response = await axios.put(`/auth/users/${id}`, data);
    return response.data;
  },

  // Xóa user (admin only)
  delete: async (id) => {
    const response = await axios.delete(`/auth/users/${id}`);
    return response.data;
  },
};