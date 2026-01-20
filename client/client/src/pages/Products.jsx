// client/src/pages/Products.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productAPI } from '../api/product.api'
import { cartAPI } from '../api/cart.api'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    fetchProducts()
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await productAPI.getAll()
      setProducts(res.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (productId) => {
    navigate(`/products/${productId}`)
  }

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!')
      navigate('/login')
      return
    }

    const availableSize = product.sizes?.find(s => s.stock > 0)
    if (!availableSize) {
      alert('Sản phẩm hiện đã hết hàng!')
      return
    }

    try {
      await cartAPI.addToCart(product._id, 1, availableSize.size)
      alert('Đã thêm vào giỏ hàng!')
      
      // Trigger event để TopBar update số lượng
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert(error.response?.data?.message || 'Có lỗi xảy ra!')
    }
  }

  // ❌ ĐÃ XÓA handleBuyNow

  // Lọc và sắp xếp sản phẩm
  const filteredProducts = products
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tất Cả Sản Phẩm</h1>
          <p className="text-gray-600">Khám phá {products.length} sản phẩm tuyệt vời</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm sản phẩm, thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <div className="md:w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="name">Tên: A → Z</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Hiển thị <span className="font-semibold text-blue-600">{filteredProducts.length}</span> sản phẩm
            {searchTerm && ` với từ khóa "${searchTerm}"`}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-500">Thử tìm kiếm với từ khóa khác nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-64 bg-gray-100">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-6xl">👟</span>
                    </div>
                  )}
                  
                  {/* Tags */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.category && (
                      <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        {product.category}
                      </span>
                    )}
                    {product.brand?.name && (
                      <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        {product.brand.name}
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleViewDetail(product._id)}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-50 transition"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                    <button 
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition"
                      title="Yêu thích"
                    >
                      <Heart className="w-5 h-5 text-gray-700 hover:text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 h-14">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="w-4 h-4 text-yellow-400 fill-current" 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">(4.8)</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {product.price?.toLocaleString()}₫
                    </span>
                  </div>

                  {/* Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Size có sẵn:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.slice(0, 4).map((sizeItem, idx) => (
                          <span 
                            key={idx}
                            className="text-xs px-2 py-1 border border-gray-300 rounded"
                          >
                            {sizeItem.size}
                          </span>
                        ))}
                        {product.sizes.length > 4 && (
                          <span className="text-xs px-2 py-1 text-gray-500">
                            +{product.sizes.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Buttons - CHỈ CÒN 2 NÚT */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewDetail(product._id)}
                      className="flex-1 bg-white border-2 border-blue-500 text-blue-600 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Chi tiết
                    </button>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Giỏ hàng
                    </button>
                  </div>

                  {/* ❌ ĐÃ XÓA NÚT MUA NGAY */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}