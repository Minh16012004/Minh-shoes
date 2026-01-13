import { useState } from 'react'
import { Search, User, ShoppingCart, X } from 'lucide-react'

export default function TopBar() {
  const [openLogin, setOpenLogin] = useState(false)

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-8">

        {/* Logo */}
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent whitespace-nowrap cursor-pointer hover:scale-105 transition-transform">
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

        {/* User Login */}
        <div className="relative">
          <button
            onClick={() => setOpenLogin(!openLogin)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all hover:scale-105"
          >
            <User className="w-5 h-5" />
            <span className="text-sm font-medium hidden lg:block">Tài khoản</span>
          </button>

          {/* Dropdown login */}
          {openLogin && (
            <>
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                onClick={() => setOpenLogin(false)}
              />
              <div className="absolute right-0 mt-4 w-96 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200">
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

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Mật khẩu
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all">
                      Đăng nhập
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                    <p className="text-center text-gray-600">
                      Chưa có tài khoản?{' '}
                      <a
                        href="/register"
                        className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Đăng ký ngay
                      </a>
                    </p>
                    <p className="text-center text-blue-600 hover:text-blue-700 cursor-pointer hover:underline">
                      Quên mật khẩu?
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Cart */}
        <div className="relative cursor-pointer group">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all hover:scale-105">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm font-medium hidden lg:block">Giỏ hàng</span>
          </div>
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold shadow-lg">
            0
          </span>
        </div>
      </div>
    </div>
  )
}