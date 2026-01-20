// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth.api';
import { orderAPI } from '../api/order.api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit2,
  LogOut,
  Shield,
  Calendar,
  TrendingUp
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  
  // User State
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'orders'
  const [orderFilter, setOrderFilter] = useState('all');
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      const userData = response.data;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Không thể tải đơn hàng!');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Vui lòng nhập họ tên!');
      return;
    }

    setUpdating(true);
    try {
      // TODO: Implement updateProfile API
      // await authAPI.updateProfile(formData);
      
      // For now, just update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      alert('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Cập nhật thất bại!');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

    try {
      await orderAPI.cancelOrder(orderId);
      alert('Đã hủy đơn hàng!');
      fetchOrders();
    } catch (error) {
      console.error('Cancel error:', error);
      alert(error.response?.data?.message || 'Không thể hủy đơn hàng!');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      'Chờ xác nhận': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      'Đã xác nhận': { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
      'Đang giao': { bg: 'bg-purple-100', text: 'text-purple-700', icon: Package },
      'Đã giao': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      'Hủy': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
    };

    const config = configs[status] || configs['Chờ xác nhận'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
        {status}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.orderStatus === orderFilter;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'Chờ xác nhận').length,
    shipping: orders.filter(o => o.orderStatus === 'Đang giao').length,
    completed: orders.filter(o => o.orderStatus === 'Đã giao').length,
    cancelled: orders.filter(o => o.orderStatus === 'Hủy').length,
    totalSpent: orders
      .filter(o => o.orderStatus !== 'Hủy')
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0)
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{user?.name || 'User'}</h1>
                <div className="flex items-center gap-2 text-blue-100 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2 text-blue-100">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="mt-3">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${
                    user?.role === 'admin' 
                      ? 'bg-yellow-400 text-yellow-900' 
                      : 'bg-white text-blue-600'
                  }`}>
                    {user?.role === 'admin' ? (
                      <>
                        <Shield className="w-4 h-4" />
                        Admin
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4" />
                        Khách hàng
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-6 py-3 bg-yellow-400 text-yellow-900 rounded-xl font-semibold hover:bg-yellow-300 transition flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Trang quản trị
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-opacity-30 transition flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-4 font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'info'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-4 font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5" />
              Lịch sử mua hàng
              {orders.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {orders.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' ? (
          // Personal Info Tab
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Email (readonly) */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4" />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0123456789"
                    />
                  </div>

                  {/* Role (readonly) */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Shield className="w-4 h-4" />
                      Vai trò
                    </label>
                    <input
                      type="text"
                      value={user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        phone: user?.phone || '',
                      });
                    }}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {updating ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                    <p className="text-lg font-semibold text-gray-800">{user?.name || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                    <p className="text-lg font-semibold text-gray-800">{user?.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Vai trò</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Order History Tab
          <div className="space-y-6">
            {/* Order Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{orderStats.total}</p>
                <p className="text-sm text-gray-600">Tổng đơn</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{orderStats.pending}</p>
                <p className="text-sm text-gray-600">Chờ xác nhận</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{orderStats.shipping}</p>
                <p className="text-sm text-gray-600">Đang giao</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{orderStats.completed}</p>
                <p className="text-sm text-gray-600">Đã giao</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{orderStats.cancelled}</p>
                <p className="text-sm text-gray-600">Đã hủy</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 shadow-sm text-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-xl font-bold">{orderStats.totalSpent.toLocaleString()}₫</p>
                <p className="text-sm opacity-90">Tổng chi tiêu</p>
              </div>
            </div>

            {/* Order Filter */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex flex-wrap gap-2">
                {['all', 'Chờ xác nhận', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Hủy'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      orderFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'all' ? 'Tất cả' : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải đơn hàng...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-800 mb-2">Chưa có đơn hàng nào</p>
                <p className="text-gray-600 mb-6">Hãy mua sắm ngay để tạo đơn hàng đầu tiên!</p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Khám phá sản phẩm
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Mã đơn hàng</p>
                          <p className="font-mono font-semibold text-gray-800">#{order._id.slice(-8)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ngày đặt</p>
                          <div className="flex items-center gap-1 text-gray-800">
                            <Calendar className="w-4 h-4" />
                            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.orderStatus)}
                      </div>
                    </div>

                    {/* Order Body */}
                    <div className="p-6">
                      {/* Products */}
                      <div className="mb-4 space-y-3">
                        {order.orderItems?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                            <img
                              src={item.image || '/placeholder.jpg'}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Size {item.size} × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">
                                {(item.price * item.quantity).toLocaleString()}₫
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.orderItems?.length > 2 && (
                          <p className="text-sm text-gray-500 text-center">
                            +{order.orderItems.length - 2} sản phẩm khác
                          </p>
                        )}
                      </div>

                      {/* Order Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600">Tổng tiền:</p>
                          <p className="text-xl font-bold text-blue-600">
                            {order.totalPrice?.toLocaleString()}₫
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/orders/${order._id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            <Eye className="w-4 h-4" />
                            Chi tiết
                          </button>
                          {order.orderStatus === 'Chờ xác nhận' && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              Hủy đơn
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}