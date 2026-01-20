// client/src/components/Header/MainNav.jsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const MainNav = () => {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState(location.pathname)

  const menuItems = [
    { 
      label: 'Trang chủ', 
      path: '/',
      icon: '🏠'
    },
    { 
      label: 'Sản phẩm', 
      path: '/products',
      icon: '👟'
    },
    { 
      label: 'Về chúng tôi', 
      path: '/about',
      icon: 'ℹ️'
    },
    { 
      label: 'Liên hệ', 
      path: '/contact',
      icon: '📞'
    },
    { 
      label: 'Khuyến mãi', 
      path: '/sale',
      icon: '🔥'
    }
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex gap-1 py-3">
          {menuItems.map((menu, idx) => (
            <li key={idx}>
              <Link
                to={menu.path}
                onClick={() => setActiveItem(menu.path)}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300
                  ${location.pathname === menu.path
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }
                `}
              >
                <span className="text-lg">{menu.icon}</span>
                {menu.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Animated underline */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </nav>
  )
}

export default MainNav