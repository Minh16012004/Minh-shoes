import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Minh Shoes
            </h3>
            <p className="text-gray-400 mb-4">
              Điểm đến tin cậy cho những đôi giày chất lượng cao. Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition transform hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition transform hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition transform hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition transform hover:scale-110">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Về Chúng Tôi</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                  Tin tức & Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                  Đối tác
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                  Chương trình khách hàng thân thiết
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                  Phương thức thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <span>123 Đường ABC, Quận XYZ, Hà Nội, Việt Nam</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>1900-xxxx (Miễn phí)</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>support@minhshoes.vn</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <Clock className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <span>Thứ 2 - Chủ nhật<br />8:00 - 22:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-700 pt-6 mb-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3 text-center">Phương thức thanh toán</h4>
          <div className="flex justify-center items-center space-x-4 flex-wrap gap-2">
            <div className="bg-white px-4 py-2 rounded shadow-md">
              <span className="text-blue-600 font-bold">VISA</span>
            </div>
            <div className="bg-white px-4 py-2 rounded shadow-md">
              <span className="text-orange-500 font-bold">Mastercard</span>
            </div>
            <div className="bg-white px-4 py-2 rounded shadow-md">
              <span className="text-blue-700 font-bold">JCB</span>
            </div>
            <div className="bg-white px-4 py-2 rounded shadow-md">
              <span className="text-red-600 font-bold">Momo</span>
            </div>
            <div className="bg-white px-4 py-2 rounded shadow-md">
              <span className="text-blue-600 font-bold">ZaloPay</span>
            </div>
            <div className="bg-white px-4 py-2 rounded shadow-md">
              <span className="text-green-600 font-bold">COD</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2026 Minh Shoes. Tất cả quyền được bảo lưu.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Điều khoản sử dụng</a>
              <a href="#" className="hover:text-white transition">Chính sách bảo mật</a>
              <a href="#" className="hover:text-white transition">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}