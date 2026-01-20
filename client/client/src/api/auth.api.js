// src/api/auth.api.js
import axios from './axios';

export const authAPI = {
  // Đăng ký (có thể upload avatar)
  register: async (formData) => {
    const response = await axios.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response; // Backend trả về { message, role }
  },

  // Đăng nhập
  login: async (data) => {
    const response = await axios.post('/auth/login', data);
    return response; // Backend trả về { message, token, user }
  },

  // Lấy thông tin profile user hiện tại
  getProfile: async () => {
    const response = await axios.get('/auth/profile');
    return response; // Backend trả về user object
  },

  // Lấy tất cả users (admin only)
  getAllUsers: async () => {
    const response = await axios.get('/auth/users');
    return response; // Backend trả về array users
  },

  // Cập nhật user (admin only)
  updateUser: async (id, data) => {
    const response = await axios.put(`/auth/users/${id}`, data);
    return response; // Backend trả về user object
  },

  // Xóa user (admin only)
  deleteUser: async (id) => {
    const response = await axios.delete(`/auth/users/${id}`);
    return response; // Backend trả về { message }
  },

  // Tạo admin mới (admin only)
  createAdmin: async (data) => {
    const response = await axios.post('/auth/admin/create', data);
    return response; // Backend trả về { message, admin }
  },

  // Đăng xuất (client side)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};