// pages/admin/BrandManage.jsx
import { useState, useEffect } from 'react';
import { brandAPI } from '../../api/brand.api';
import Modal from '../../components/admin/Modal';

export default function BrandManage() {
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, brandId: null });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await brandAPI.getAll();
      // Backend trả về array trực tiếp trong response.data
      setBrands(response.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await brandAPI.update(editingBrand._id, formData);
      } else {
        await brandAPI.create(formData);
      }
      fetchBrands();
      resetForm();
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      logo: brand.logo || '',
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await brandAPI.delete(deleteModal.brandId);
      fetchBrands();
      setDeleteModal({ isOpen: false, brandId: null });
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', logo: '' });
    setEditingBrand(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý thương hiệu</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Đóng' : '+ Thêm thương hiệu'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tên thương hiệu"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <input
              type="text"
              placeholder="URL logo"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {editingBrand ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Brand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div key={brand._id} className="bg-white rounded-lg shadow p-6">
            {brand.logo && (
              <img src={brand.logo} alt={brand.name} className="w-full h-32 object-contain mb-4" />
            )}
            <h3 className="text-lg font-semibold mb-2">{brand.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{brand.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(brand)}
                className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
              >
                Sửa
              </button>
              <button
                onClick={() => setDeleteModal({ isOpen: true, brandId: brand._id })}
                className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, brandId: null })}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa thương hiệu này?"
        type="danger"
      />
    </div>
  );
}