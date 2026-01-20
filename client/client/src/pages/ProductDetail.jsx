// client/src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productAPI } from '../api/product.api'
import { cartAPI } from '../api/cart.api'
import { Heart, ShoppingCart, Star, Truck, Shield, RefreshCw, ChevronLeft, Check } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await productAPI.getById(id)
      setProduct(res.data)
      
      const allProducts = await productAPI.getAll()
      const related = allProducts.data
        .filter(p => 
          p._id !== id && 
          (p.category === res.data.category || p.brand?._id === res.data.brand?._id)
        )
        .slice(0, 4)
      setRelatedProducts(related)
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Không tìm thấy sản phẩm!')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!')
      navigate('/login')
      return
    }

    if (!selectedSize) {
      alert('Vui lòng chọn size!')
      return
    }

    try {
      await cartAPI.addToCart(product._id, quantity, selectedSize)
      alert(`Đã thêm ${quantity} sản phẩm size ${selectedSize} vào giỏ hàng!`)
      
      // Trigger event để TopBar update
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert(error.response?.data?.message || 'Có lỗi xảy ra!')
    }
  }

  // ✅ CẬP NHẬT handleBuyNow - Thêm vào Cart API rồi chuyển Checkout
  const handleBuyNow = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Vui lòng đăng nhập để mua hàng!')
      navigate('/login')
      return
    }

    if (!selectedSize) {
      alert('Vui lòng chọn size!')
      return
    }

    try {
      // Thêm sản phẩm vào Cart API
      await cartAPI.addToCart(product._id, quantity, selectedSize)
      
      // Chuyển sang trang Checkout - Checkout sẽ tự động lấy từ Cart API
      navigate('/checkout')
    } catch (error) {
      console.error('Error:', error)
      alert(error.response?.data?.message || 'Có lỗi xảy ra!')
    }
  }

  const goBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Product Main Info */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Images */}
            <div>
              {/* Main Image */}
              <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 aspect-square">
                <img
                  src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`rounded-lg overflow-hidden aspect-square border-2 transition ${
                        selectedImage === idx
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category & Brand */}
              <div className="flex gap-2 mb-3">
                {product.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                    {product.category}
                  </span>
                )}
                {product.brand?.name && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                    {product.brand.name}
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.8/5 - 127 đánh giá)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-blue-600">
                    {product.price?.toLocaleString()}₫
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {(product.price * 1.3).toLocaleString()}₫
                  </span>
                  <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full font-semibold">
                    -30%
                  </span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Mô tả:</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Chọn size:</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {product.sizes.map((sizeItem, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(sizeItem.size)}
                        disabled={sizeItem.stock === 0}
                        className={`
                          py-3 rounded-lg font-semibold transition relative
                          ${sizeItem.stock === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : selectedSize === sizeItem.size
                            ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500'
                          }
                        `}
                      >
                        {sizeItem.size}
                        {sizeItem.stock === 0 && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs bg-white text-red-500 px-2 py-1 rounded">Hết</span>
                          </span>
                        )}
                        {selectedSize === sizeItem.size && (
                          <Check className="w-4 h-4 absolute top-1 right-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Số lượng:</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition font-bold"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-blue-500 text-blue-600 py-4 rounded-xl font-bold hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  🔥 Mua ngay
                </button>
                <button className="w-14 h-14 rounded-xl border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 transition flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gray-600 hover:text-red-500" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-8 h-8 text-green-500" />
                  <span className="text-sm text-gray-600">Miễn phí vận chuyển</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield className="w-8 h-8 text-blue-500" />
                  <span className="text-sm text-gray-600">Chính hãng 100%</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RefreshCw className="w-8 h-8 text-orange-500" />
                  <span className="text-sm text-gray-600">Đổi trả 30 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/products/${item._id}`)}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition group"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/300'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-blue-600 font-bold">{item.price?.toLocaleString()}₫</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}