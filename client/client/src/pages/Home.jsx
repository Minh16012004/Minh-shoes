import React, { useState } from 'react';
import { Heart, Star, TrendingUp, Zap, Award } from 'lucide-react';

const ShoeStore = () => {
  const [cartCount, setCartCount] = useState(0);

  const featuredProducts = [
    {
      id: 1,
      name: 'Air Max Premium',
      price: '2.499.000',
      oldPrice: '3.299.000',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      tag: 'Hot',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Ultra Boost Runner',
      price: '2.899.000',
      oldPrice: null,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
      tag: 'New',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Classic Leather Low',
      price: '1.799.000',
      oldPrice: '2.199.000',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      tag: 'Sale',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Sport Performance X',
      price: '3.299.000',
      oldPrice: null,
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
      tag: 'Hot',
      rating: 4.9
    },
    {
      id: 5,
      name: 'Running Pro Elite',
      price: '2.199.000',
      oldPrice: '2.799.000',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
      tag: 'Sale',
      rating: 4.6
    },
    {
      id: 6,
      name: 'Street Style Urban',
      price: '1.999.000',
      oldPrice: null,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
      tag: 'New',
      rating: 4.8
    },
    {
      id: 7,
      name: 'Premium Comfort Flex',
      price: '2.699.000',
      oldPrice: '3.199.000',
      image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop',
      tag: 'Hot',
      rating: 4.9
    },
    {
      id: 8,
      name: 'Adventure Trail Max',
      price: '2.399.000',
      oldPrice: null,
      image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=400&fit=crop',
      tag: 'New',
      rating: 4.7
    }
  ];

  const categories = [
    { name: 'Giày Thể Thao', icon: '⚡', color: 'from-blue-500 to-cyan-500' },
    { name: 'Giày Chạy Bộ', icon: '🏃', color: 'from-green-500 to-emerald-500' },
    { name: 'Giày Cao Cấp', icon: '👔', color: 'from-purple-500 to-pink-500' },
    { name: 'Giày Sneaker', icon: '👟', color: 'from-orange-500 to-red-500' }
  ];

  const brands = [
    { name: 'Nike', logo: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=100&fit=crop' },
    { name: 'Adidas', logo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=100&fit=crop' },
    { name: 'Puma', logo: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=200&h=100&fit=crop' },
    { name: 'New Balance', logo: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=200&h=100&fit=crop' },
    { name: 'Converse', logo: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&h=100&fit=crop' },
    { name: 'Vans', logo: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=100&fit=crop' }
  ];

  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Hero Section / Banner */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="inline-block bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold animate-pulse">
                Bộ sưu tập mới 2026
              </span>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Bước Đi Của Bạn,<br />Phong Cách Của Chúng Tôi
              </h2>
              <p className="text-xl text-gray-100">
                Khám phá những đôi giày cao cấp với thiết kế độc đáo và công nghệ tiên tiến nhất
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg">
                  Mua Ngay
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition transform hover:scale-105">
                  Xem Thêm
                </button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-gray-200 text-sm">Sản phẩm</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-gray-200 text-sm">Khách hàng</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4.9★</div>
                  <div className="text-gray-200 text-sm">Đánh giá</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop"
                alt="Featured Shoe"
                className="rounded-3xl shadow-2xl transform rotate-12 hover:rotate-0 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition transform hover:scale-105">
              <Zap className="w-10 h-10 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-800">Giao Hàng Nhanh</h3>
                <p className="text-sm text-gray-600">Miễn phí vận chuyển</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition transform hover:scale-105">
              <Award className="w-10 h-10 text-green-600" />
              <div>
                <h3 className="font-bold text-gray-800">Chính Hãng 100%</h3>
                <p className="text-sm text-gray-600">Bảo hành chính hãng</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition transform hover:scale-105">
              <TrendingUp className="w-10 h-10 text-purple-600" />
              <div>
                <h3 className="font-bold text-gray-800">Giá Tốt Nhất</h3>
                <p className="text-sm text-gray-600">Cam kết giá rẻ</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition transform hover:scale-105">
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
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Danh Mục Sản Phẩm</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className={`bg-gradient-to-br ${cat.color} p-8 rounded-2xl text-center text-white transform group-hover:scale-105 transition shadow-lg hover:shadow-2xl`}>
                <div className="text-6xl mb-4">{cat.icon}</div>
                <h3 className="text-xl font-bold">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Sản Phẩm Nổi Bật</h2>
            <button className="text-blue-600 font-semibold hover:underline flex items-center gap-2">
              Xem tất cả →
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-semibold ${
                    product.tag === 'Hot' ? 'bg-red-500' : 
                    product.tag === 'New' ? 'bg-green-500' : 'bg-orange-500'
                  }`}>
                    {product.tag}
                  </span>
                  <button className="absolute top-4 left-4 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-50">
                    <Heart className="w-5 h-5 text-gray-700 hover:text-red-500" />
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{product.price}₫</span>
                      {product.oldPrice && (
                        <div className="text-sm text-gray-400 line-through">{product.oldPrice}₫</div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={addToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Thương Hiệu Nổi Tiếng</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="w-full h-16 object-contain grayscale hover:grayscale-0 transition"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-4">FLASH SALE 50%</h2>
            <p className="text-2xl mb-8">Chỉ trong hôm nay - Đừng bỏ lỡ!</p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-white text-gray-900 px-6 py-4 rounded-lg">
                <div className="text-3xl font-bold">02</div>
                <div className="text-sm">Giờ</div>
              </div>
              <div className="bg-white text-gray-900 px-6 py-4 rounded-lg">
                <div className="text-3xl font-bold">35</div>
                <div className="text-sm">Phút</div>
              </div>
              <div className="bg-white text-gray-900 px-6 py-4 rounded-lg">
                <div className="text-3xl font-bold">47</div>
                <div className="text-sm">Giây</div>
              </div>
            </div>
            <button className="bg-white text-red-600 px-12 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-xl">
              MUA NGAY
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Đăng Ký Nhận Ưu Đãi</h2>
          <p className="text-xl mb-8">Nhận ngay mã giảm giá 15% cho đơn hàng đầu tiên</p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Nhập email của bạn..."
              className="flex-1 px-6 py-3 rounded-l-full outline-none text-gray-800"
            />
            <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-r-full font-semibold hover:bg-yellow-300 transition">
              Đăng Ký
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ShoeStore;