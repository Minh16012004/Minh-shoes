// pages/Checkout.jsx - ✅ FIXED VERSION
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Truck, ArrowLeft, Loader2 } from 'lucide-react';
import { orderAPI } from '../api/order.api';
import { cartAPI } from '../api/cart.api';

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập!');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      const cartData = res.data?.data;

      if (!cartData || cartData.items.length === 0) {
        alert('Giỏ hàng trống!');
        navigate('/cart');
        return;
      }

      console.log('📦 Cart loaded:', cartData);
      console.log('💰 Cart totalPrice from API:', cartData.totalPrice);
      setCart(cartData);

      // Load thông tin user
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.name) {
        setShippingInfo(prev => ({
          ...prev,
          fullName: user.name,
          phone: user.phone || ''
        }));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Không thể tải giỏ hàng!');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED - Tính từ items thay vì dùng cart.totalPrice
  const calculateTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return { itemsPrice: 0, shippingPrice: 0, totalPrice: 0 };
    }

    // ✅ Tính tổng từ items (đảm bảo chính xác)
    const itemsPrice = cart.items.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    }, 0);

    console.log('💵 Items Price calculated:', itemsPrice);
    console.log('📊 Cart items:', cart.items.map(i => ({
      name: i.product?.name,
      price: i.price,
      quantity: i.quantity,
      subtotal: i.price * i.quantity
    })));

    const shippingPrice = itemsPrice > 500000 ? 0 : 30000;
    const totalPrice = itemsPrice + shippingPrice;

    return { itemsPrice, shippingPrice, totalPrice };
  };

  const { itemsPrice, shippingPrice, totalPrice } = calculateTotal();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate form
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    setSubmitting(true);

    try {
      // ✅ Format order items từ cart API
      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.product.images?.[0] || ''
      }));

      console.log('📦 Creating order with items:', orderItems);
      console.log('💰 Order total:', totalPrice);

      // Tạo đơn hàng
      const orderData = {
        shippingInfo,
        orderItems,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice
      };

      const response = await orderAPI.createOrder(orderData);

      console.log('✅ Order created:', response.data);

      // ✅ Xóa giỏ hàng sau khi đặt hàng thành công
      await cartAPI.clearCart();

      alert('Đặt hàng thành công!');
      navigate(`/orders/${response.data.order._id}`);
    } catch (error) {
      console.error('Order error:', error);
      alert(error.response?.data?.message || 'Đặt hàng thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại giỏ hàng</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600 mt-2">Hoàn tất đơn hàng của bạn</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Thông tin */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin giao hàng */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Thông tin giao hàng</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.district}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phường/Xã
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.ward}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, ward: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ cụ thể <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    placeholder="Số nhà, tên đường..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (không bắt buộc)
                  </label>
                  <textarea
                    value={shippingInfo.note}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, note: e.target.value })}
                    rows="3"
                    placeholder="Ghi chú về đơn hàng..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Phương thức thanh toán</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">Đơn hàng</h2>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img
                      src={item.product?.images?.[0] || '/placeholder.jpg'}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                      <p className="text-sm text-gray-700">
                        {item.price?.toLocaleString()}₫ x {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-blue-600">
                        = {(item.price * item.quantity).toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tổng tiền */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-semibold">{itemsPrice.toLocaleString()}₫</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Phí vận chuyển
                  </span>
                  <span>{shippingPrice === 0 ? 'Miễn phí' : `${shippingPrice.toLocaleString()}₫`}</span>
                </div>

                <div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600 text-2xl">{totalPrice.toLocaleString()}₫</span>
                </div>
              </div>

              {/* Nút đặt hàng */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Đặt hàng</span>
                )}
              </button>

              {/* Debug Info - Xóa sau khi test xong */}
              <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
                <p>🔍 Debug:</p>
                <p>Items: {cart.items.length}</p>
                <p>Tạm tính: {itemsPrice.toLocaleString()}₫</p>
                <p>Ship: {shippingPrice.toLocaleString()}₫</p>
                <p>Tổng: {totalPrice.toLocaleString()}₫</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}