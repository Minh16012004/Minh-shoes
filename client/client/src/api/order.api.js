// src/api/order.api.js
import axios from './axios';

export const orderAPI = {
  // Tạo đơn hàng mới
  createOrder: async (data) => {
    const response = await axios.post('/orders', data);
    return response;
  },

  // Lấy đơn hàng của tôi
  getMyOrders: async () => {
    const response = await axios.get('/orders/my-orders');
    return response;
  },

  // Lấy chi tiết đơn hàng
  getOrderDetail: async (id) => {
    const response = await axios.get(`/orders/${id}`);
    return response;
  },

  // Hủy đơn hàng
  cancelOrder: async (id) => {
    const response = await axios.put(`/orders/${id}/cancel`);
    return response;
  },

  // ADMIN - Lấy tất cả đơn hàng
  getAllOrders: async () => {
    const response = await axios.get('/orders/admin/all');
    return response;
  },

  // ADMIN - Cập nhật trạng thái
  updateOrderStatus: async (id, status) => {
    const response = await axios.put(`/orders/admin/${id}/status`, { orderStatus: status });
    return response;
  },
};