import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const Dropdown = ({ items }) => {
  return (
    <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
      <div className="py-2">
        {items.map((item, idx) => (
          <a
            key={idx}
            href="#"
            className="block px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all font-medium"
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  )
}

const MainNav = () => {
  const [activeItem, setActiveItem] = useState('Trang chủ')

  const menuItems = [
    { 
      label: 'Trang chủ', 
      items: null 
    },
    { 
      label: 'Giày Nam', 
      items: ['Nike Nam', 'Adidas Nam', 'MLB Nam', 'Giày Chạy Bộ', 'Giày Bóng Rổ'] 
    },
    { 
      label: 'Giày Nữ', 
      items: ['Nike Nữ', 'Adidas Nữ', 'Sneaker Nữ', 'Giày Thời Trang'] 
    },
    { 
      label: 'Sneaker', 
      items: ['Air Force 1', 'Jordan', 'Dunk', 'Stan Smith'] 
    },
    { 
      label: 'Thương Hiệu', 
      items: ['Nike', 'Adidas', 'MLB', 'Puma', 'Converse'] 
    }
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex gap-2 py-4">
          {menuItems.map((menu, idx) => (
            <li 
              key={idx}
              className="relative group"
            >
              <button
                onClick={() => setActiveItem(menu.label)}
                className={`
                  flex items-center gap-1 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300
                  ${activeItem === menu.label 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }
                `}
              >
                {menu.label}
                {menu.items && (
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-180 ${activeItem === menu.label ? 'text-white' : ''}`} />
                )}
              </button>
              
              {menu.items && <Dropdown items={menu.items} />}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Animated underline effect */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </nav>
  )
}

export default MainNav