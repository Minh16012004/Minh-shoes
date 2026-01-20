// components/admin/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/products', icon: '👕', label: 'Sản phẩm' },
    { path: '/admin/brands', icon: '🏷️', label: 'Thương hiệu' },
    { path: '/admin/users', icon: '👥', label: 'Người dùng' },
  ];

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Fashion Shop
        </h2>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>
      
      {/* Menu Items */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-gray-800 space-y-2">
        {/* Back to Home Button */}
        <button
          onClick={handleBackToHome}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-green-400 hover:bg-gray-800 hover:text-green-300 transition group"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Về trang chủ</span>
        </button>

        {/* Optional: Logout Button */}
        <button
          onClick={() => {
            if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}