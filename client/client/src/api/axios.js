// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://minh-shoes-1.onrender.com', // URL backend của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm token vào mỗi request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;