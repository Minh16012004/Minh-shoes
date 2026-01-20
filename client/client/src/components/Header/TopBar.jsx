// components/Header/TopBar.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, User, ShoppingCart, X, LogOut, Settings, LayoutDashboard } from 'lucide-react'
import { authAPI } from '../../api/auth.api'

export default function TopBar() {
  const navigate = useNavigate()
  const [openLogin, setOpenLogin] = useState(false)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  // Check user đã login chưa khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing user:', error)
      }
    }

    // Load cart count từ localStorage
    loadCartCount()
  }, [])

  // Load số lượng sản phẩm trong giỏ hàng
  const loadCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
      setCartCount(totalItems)
    } catch (error) {
      console.error('Error loading cart:', error)
      setCartCount(0)
    }
  }

  // Hàm này để các component khác có thể gọi để update cart count
  useEffect(() => {
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartCount()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.login(loginForm)
      
      // Lưu token và user info
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Set user state
      setUser(response.data.user)
      
      // Đóng modal
      setOpenLogin(false)
      
      // Reset form
      setLoginForm({ email: '', password: '' })
      
      alert('Đăng nhập thành công!')
    } catch (error) {
      console.error('Login error:', error)
      alert(error.response?.data?.message || 'Đăng nhập thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setOpenUserMenu(false)
    navigate('/')
    alert('Đã đăng xuất!')
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-8">

        {/* Logo */}
        <div 
          onClick={() => navigate('/')}
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent whitespace-nowrap cursor-pointer hover:scale-105 transition-transform"
        >
          Minh Shoes
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <input
              type="text"
              placeholder="Tìm kiếm giày, thương hiệu..."
              className="w-full px-5 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 outline-none focus:bg-white/15 focus:border-blue-400 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
          </div>
        </div>

        {/* User - Hiển thị khác nhau khi đã login */}
        <div className="relative">
          {user ? (
            // Đã đăng nhập - Hiển thị avatar + menu
            <>
              <button
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all hover:scale-105"
              >
                {/* Avatar - Hiển thị ảnh upload hoặc chữ cái đầu */}
                {user.avatar ? (
                  <img 
                    src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                    onError={(e) => {
                      // Nếu ảnh lỗi, hiển thị chữ cái đầu
                      e.target.style.display = 'none'
                      e.target.nextElementSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div 
                  className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm ${user.avatar ? 'hidden' : ''}`}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden lg:block">{user.name}</span>
              </button>

              {/* User Menu Dropdown */}
              {openUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 bg-transparent"
                    onClick={() => setOpenUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-4 w-64 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* User Info */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar trong dropdown */}
                        {user.avatar ? (
                          <img 
                            src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextElementSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg ${user.avatar ? 'hidden' : ''}`}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-white">
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-white/80">{user.email}</p>
                        </div>
                      </div>
                      {user.role === 'admin' && (
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                          ADMIN
                        </span>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/profile')
                          setOpenUserMenu(false)
                        }}
                        className="w-full px-4 py-3 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                      >
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium">Trang cá nhân</span>
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            navigate('/admin/dashboard')
                            setOpenUserMenu(false)
                          }}
                          className="w-full px-4 py-3 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                        >
                          <LayoutDashboard className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium text-purple-600">Quản trị Admin</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          navigate('/settings')
                          setOpenUserMenu(false)
                        }}
                        className="w-full px-4 py-3 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                      >
                        <Settings className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium">Cài đặt</span>
                      </button>

                      <hr className="my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 hover:bg-red-50 flex items-center gap-3 transition-colors text-red-600"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            // Chưa đăng nhập - Hiển thị nút login
            <>
              <button
                onClick={() => setOpenLogin(!openLogin)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all hover:scale-105"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium hidden lg:block">Tài khoản</span>
              </button>

              {/* Login Modal */}
              {openLogin && (
                <>
                  <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                    onClick={() => setOpenLogin(false)}
                  />
                  <div className="absolute right-0 mt-4 w-96 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 relative">
                      <button
                        onClick={() => setOpenLogin(false)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <h3 className="font-bold text-xl text-white text-center">
                        Chào mừng trở lại!
                      </h3>
                      <p className="text-white/80 text-sm text-center mt-1">
                        Đăng nhập để tiếp tục
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            placeholder="your.email@example.com"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                            disabled={loading}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Mật khẩu
                          </label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                            disabled={loading}
                          />
                        </div>

                        <button 
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                        <p className="text-center text-gray-600">
                          Chưa có tài khoản?{' '}
                          <Link
                            to="/register"
                            onClick={() => setOpenLogin(false)}
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            Đăng ký ngay
                          </Link>
                        </p>
                        <p className="text-center text-blue-600 hover:text-blue-700 cursor-pointer hover:underline">
                          Quên mật khẩu?
                        </p>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Cart */}
        <div 
          onClick={() => navigate('/cart')}
          className="relative cursor-pointer group"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all hover:scale-105">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm font-medium hidden lg:block">Giỏ hàng</span>
          </div>
          {/* Badge số lượng - Chỉ hiển thị khi có sản phẩm */}
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs min-w-[24px] h-6 flex items-center justify-center rounded-full font-bold shadow-lg px-1.5 animate-bounce">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}