import React, { useState, useEffect } from 'react';
import { Heart, Star, Loader2, Zap, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { productAPI } from '../api/product.api';

const ShoeStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      const productsArray = Array.isArray(data) ? data : (data.data || data.products || []);
      setProducts(productsArray);
      setError(null);
    } catch (err) {
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy 8 sản phẩm đầu tiên để hiển thị
  const featuredProducts = products.slice(0, 8);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const addToCart = (product) => {
    // Lưu vào localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Hiển thị thông báo
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    
    // Trigger event để update cart count ở header (nếu có)
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const categories = [
    { name: 'Giày Thể Thao', icon: '⚡', color: 'from-blue-500 to-cyan-500' },
    { name: 'Giày Chạy Bộ', icon: '🏃', color: 'from-green-500 to-emerald-500' },
    { name: 'Giày Cao Cấp', icon: '👔', color: 'from-purple-500 to-pink-500' },
    { name: 'Giày Sneaker', icon: '👟', color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="inline-block bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                Bộ sưu tập mới 2026
              </span>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Bước Đi Của Bạn,<br />Phong Cách Của Chúng Tôi
              </h2>
              <p className="text-lg text-gray-100">
                Khám phá những đôi giày cao cấp với thiết kế độc đáo và công nghệ tiên tiến nhất
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Mua Ngay
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                  Xem Thêm
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop"
                alt="Featured Shoe"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4 p-6 bg-blue-50 rounded-xl hover:shadow-lg transition">
              <Zap className="w-10 h-10 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-800">Giao Hàng Nhanh</h3>
                <p className="text-sm text-gray-600">Miễn phí vận chuyển</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-green-50 rounded-xl hover:shadow-lg transition">
              <Award className="w-10 h-10 text-green-600" />
              <div>
                <h3 className="font-bold text-gray-800">Chính Hãng 100%</h3>
                <p className="text-sm text-gray-600">Bảo hành chính hãng</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-purple-50 rounded-xl hover:shadow-lg transition">
              <TrendingUp className="w-10 h-10 text-purple-600" />
              <div>
                <h3 className="font-bold text-gray-800">Giá Tốt Nhất</h3>
                <p className="text-sm text-gray-600">Cam kết giá rẻ</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-orange-50 rounded-xl hover:shadow-lg transition">
              <Heart className="w-10 h-10 text-orange-600" />
              <div>
                <h3 className="font-bold text-gray-800">Hỗ Trợ 24/7</h3>
                <p className="text-sm text-gray-600">Tư vấn nhiệt tình</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Danh Mục Sản Phẩm</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className={`bg-gradient-to-br ${cat.color} p-8 rounded-xl text-center text-white transform group-hover:scale-105 transition shadow-lg`}>
                <div className="text-5xl mb-3">{cat.icon}</div>
                <h3 className="text-lg font-bold">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Sản Phẩm Nổi Bật</h2>
            <button className="text-blue-600 font-semibold hover:underline flex items-center gap-2">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Đang tải sản phẩm...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';
                      }}
                    />
                    <button className="absolute top-4 left-4 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-50">
                      <Heart className="w-5 h-5 text-gray-700 hover:text-red-500" />
                    </button>
                    {product.tag && (
                      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-semibold ${
                        product.tag === 'Hot' ? 'bg-red-500' : 
                        product.tag === 'New' ? 'bg-green-500' : 'bg-orange-500'
                      }`}>
                        {product.tag}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    
                    {product.rating && (
                      <div className="flex items-center mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                      </div>
                    )}

                    <div className="mb-4">
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <div className="text-sm text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Chưa có sản phẩm nào</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ShoeStore;