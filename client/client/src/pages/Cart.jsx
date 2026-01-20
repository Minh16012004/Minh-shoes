// client/src/pages/Cart.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartAPI } from '../api/cart.api'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag } from 'lucide-react'

export default function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      const res = await cartAPI.getCart()
      setCart(res.data.data)
    } catch (error) {
      console.error('Error fetching cart:', error)
      if (error.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      setUpdating(true)
      await cartAPI.updateItem(itemId, newQuantity)
      await fetchCart()
    } catch (error) {
      console.error('Error updating:', error)
      alert('Có lỗi khi cập nhật!')
    } finally {
      setUpdating(false)
    }
  }

  const removeItem = async (itemId) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return

    try {
      setUpdating(true)
      await cartAPI.removeItem(itemId)
      await fetchCart()
    } catch (error) {
      console.error('Error removing:', error)
      alert('Có lỗi khi xóa!')
    } finally {
      setUpdating(false)
    }
  }

  const clearCart = async () => {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return

    try {
      setUpdating(true)
      await cartAPI.clearCart()
      await fetchCart()
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert('Có lỗi khi xóa!')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng nhé!</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Giỏ Hàng</h1>
          <p className="text-gray-600 mt-2">Bạn có {cart.items.length} sản phẩm trong giỏ</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex gap-4">
                  
                  {/* Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={item.product?.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1">
                          {item.product?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            Size: {item.size}
                          </span>
                          {item.product?.brand?.name && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                              {item.product.brand.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        disabled={updating}
                        className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={updating || item.quantity <= 1}
                          className="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 transition disabled:opacity-50 flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={updating}
                          className="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 transition disabled:opacity-50 flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {(item.price * item.quantity).toLocaleString()}₫
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.price.toLocaleString()}₫ x {item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              disabled={updating}
              className="w-full py-3 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50 font-medium"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({cart.items.length} sản phẩm)</span>
                  <span className="font-semibold">{cart.totalPrice?.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-semibold">Miễn phí</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600 text-2xl">{cart.totalPrice?.toLocaleString()}₫</span>
                </div>
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105 mb-4">
                Thanh toán
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Tiếp tục mua sắm
              </button>

              {/* Features */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Miễn phí vận chuyển đơn từ 500k</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Đổi trả trong 30 ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}