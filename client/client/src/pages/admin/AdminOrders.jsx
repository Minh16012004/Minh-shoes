// pages/admin/AdminOrders.jsx
import { useState, useEffect } from 'react';
import { Eye, Package, Clock, CheckCircle, XCircle, Search, Filter, Calendar } from 'lucide-react';
import { orderAPI } from '../../api/order.api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getAllOrders();
      const ordersData = res.data.orders;
      setOrders(ordersData);
      
      // Calculate stats
      const stats = {
        total: ordersData.length,
        pending: ordersData.filter(o => o.orderStatus === 'Chờ xác nhận').length,
        confirmed: ordersData.filter(o => o.orderStatus === 'Đã xác nhận').length,
        shipping: ordersData.filter(o => o.orderStatus === 'Đang giao').length,
        delivered: ordersData.filter(o => o.orderStatus === 'Đã giao').length,
        cancelled: ordersData.filter(o => o.orderStatus === 'Hủy').length,
        totalRevenue: res.data.totalAmount || 0
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Không thể tải đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Xác nhận chuyển trạng thái sang "${newStatus}"?`)) return;

    try {
      setUpdating(true);
      await orderAPI.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      setShowModal(false);
      alert('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Cập nhật thất bại!');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Chờ xác nhận': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      'Đã xác nhận': { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
      'Đang giao': { bg: 'bg-purple-100', text: 'text-purple-700', icon: Package },
      'Đã giao': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      'Hủy': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig['Chờ xác nhận'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
        {status}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    return status === 'Đã thanh toán' ? (
      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓ Đã thanh toán</span>
    ) : (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">○ Chưa thanh toán</span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Quản lý đơn hàng</h1>
        <p className="text-gray-600 mt-1">Theo dõi và quản lý tất cả đơn hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm opacity-90">Tổng đơn hàng</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-sm opacity-90">Chờ xác nhận</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-2xl font-bold">{stats.confirmed}</p>
          <p className="text-sm opacity-90">Đã xác nhận</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-2xl font-bold">{stats.shipping}</p>
          <p className="text-sm opacity-90">Đang giao</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-2xl font-bold">{stats.delivered}</p>
          <p className="text-sm opacity-90">Đã giao</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-2xl font-bold">{stats.cancelled}</p>
          <p className="text-sm opacity-90">Đã hủy</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-xl font-bold">{stats.totalRevenue.toLocaleString()}₫</p>
          <p className="text-sm opacity-90">Doanh thu</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, tên khách hàng, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Đã giao">Đã giao</option>
              <option value="Hủy">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg">Không tìm thấy đơn hàng nào</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-gray-900">#{order._id.slice(-8)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.user?.name}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                        <p className="text-xs text-gray-500">{order.shippingInfo?.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{order.orderItems?.length} sản phẩm</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-blue-600">
                        {order.totalPrice?.toLocaleString()}₫
                      </p>
                      <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Eye className="w-4 h-4" />
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
                <p className="text-sm text-gray-500">#{selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Họ tên:</p>
                    <p className="font-medium">{selectedOrder.shippingInfo?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Số điện thoại:</p>
                    <p className="font-medium">{selectedOrder.shippingInfo?.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Địa chỉ:</p>
                    <p className="font-medium">
                      {selectedOrder.shippingInfo?.address}, {selectedOrder.shippingInfo?.ward}, {selectedOrder.shippingInfo?.district}, {selectedOrder.shippingInfo?.city}
                    </p>
                  </div>
                  {selectedOrder.shippingInfo?.note && (
                    <div className="col-span-2">
                      <p className="text-gray-600">Ghi chú:</p>
                      <p className="font-medium">{selectedOrder.shippingInfo.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Sản phẩm đặt mua</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} className="flex gap-4 bg-gray-50 rounded-lg p-4">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm text-gray-600">
                          {item.price?.toLocaleString()}₫ × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          {(item.price * item.quantity)?.toLocaleString()}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">{selectedOrder.itemsPrice?.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">{selectedOrder.shippingPrice?.toLocaleString()}₫</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{selectedOrder.totalPrice?.toLocaleString()}₫</span>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-3">Cập nhật trạng thái</h3>
                <div className="flex flex-wrap gap-2">
                  {['Chờ xác nhận', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Hủy'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                      disabled={updating || selectedOrder.orderStatus === status}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedOrder.orderStatus === status
                          ? 'bg-blue-600 text-white cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}