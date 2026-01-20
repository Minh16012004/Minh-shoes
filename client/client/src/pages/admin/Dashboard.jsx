// pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { productAPI } from '../../api/product.api';
import { authAPI } from '../../api/auth.api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Lấy tổng sản phẩm
      const productsRes = await productAPI.getAll();
      const products = productsRes.data || [];
      
      // Lấy tổng users
      const usersRes = await authAPI.getAllUsers();
      const users = usersRes.data || [];
      
      setStats(prev => ({ 
        ...prev, 
        totalProducts: products.length,
        totalUsers: users.length
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { title: 'Tổng sản phẩm', value: stats.totalProducts, icon: '📦', color: 'bg-blue-500' },
    { title: 'Người dùng', value: stats.totalUsers, icon: '👥', color: 'bg-green-500' },
    { title: 'Đơn hàng', value: stats.totalOrders, icon: '🛒', color: 'bg-yellow-500' },
    { title: 'Doanh thu', value: `${stats.totalRevenue.toLocaleString()}đ`, icon: '💰', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
        <p className="text-gray-500">Chưa có dữ liệu</p>
      </div>
    </div>
  );
}