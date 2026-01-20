// pages/admin/ProductManage.jsx
import { useState, useEffect } from 'react';
import { productAPI } from '../../api/product.api';
import { brandAPI } from '../../api/brand.api';
import { uploadAPI } from '../../api/upload.api';
import Modal from '../../components/admin/Modal';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

export default function ProductManage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    gender: 'unisex',
    sizes: [{ size: '', stock: '' }],
  });

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await brandAPI.getAll();
      setBrands(response.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  // Upload nhiều ảnh
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Giới hạn 5 ảnh
    if (uploadedImages.length + files.length > 5) {
      alert('Chỉ được upload tối đa 5 ảnh!');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadAPI.uploadMultiple(files);
      setUploadedImages([...uploadedImages, ...response.urls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Có lỗi khi upload ảnh!');
    } finally {
      setUploading(false);
    }
  };

  // Xóa ảnh đã upload
  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadedImages.length === 0) {
      alert('Vui lòng upload ít nhất 1 ảnh!');
      return;
    }

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        brand: formData.brand,
        category: formData.category,
        gender: formData.gender,
        images: uploadedImages,
        sizes: formData.sizes.map(s => ({
          size: Number(s.size),
          stock: Number(s.stock)
        })).filter(s => s.size && s.stock >= 0),
      };

      if (editingProduct) {
        await productAPI.update(editingProduct._id, data);
      } else {
        await productAPI.create(data);
      }

      fetchProducts();
      resetForm();
      alert('Lưu sản phẩm thành công!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setUploadedImages(product.images || []);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      brand: product.brand?._id || product.brand || '',
      category: product.category || '',
      gender: product.gender || 'unisex',
      sizes: product.sizes?.length > 0 
        ? product.sizes.map(s => ({ size: s.size, stock: s.stock }))
        : [{ size: '', stock: '' }],
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await productAPI.delete(deleteModal.productId);
      fetchProducts();
      setDeleteModal({ isOpen: false, productId: null });
      alert('Xóa sản phẩm thành công!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Có lỗi khi xóa!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      brand: '',
      category: '',
      gender: 'unisex',
      sizes: [{ size: '', stock: '' }],
    });
    setUploadedImages([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const addSizeField = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: '', stock: '' }]
    });
  };

  const removeSizeField = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  const updateSize = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = value;
    setFormData({ ...formData, sizes: newSizes });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Đóng' : '+ Thêm sản phẩm'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <input
                type="text"
                placeholder="Tên sản phẩm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Description */}
              <textarea
                placeholder="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />

              {/* Price */}
              <input
                type="number"
                placeholder="Giá (VNĐ)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Brand Select */}
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Chọn thương hiệu --</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>

              {/* Category */}
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn danh mục --</option>
                <option value="Giày Nam">Giày Nam</option>
                <option value="Giày Nữ">Giày Nữ</option>
                <option value="Giày Thể Thao">Giày Thể Thao</option>
                <option value="Giày Chạy Bộ">Giày Chạy Bộ</option>
                <option value="Giày Sneaker">Giày Sneaker</option>
                <option value="Dép/Sandal">Dép/Sandal</option>
              </select>

              {/* Gender */}
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unisex">Unisex</option>
                <option value="nam">Nam</option>
                <option value="nữ">Nữ</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="border-t pt-4">
              <label className="block font-medium text-gray-700 mb-3">
                Hình ảnh sản phẩm (Tối đa 5 ảnh)
              </label>
              
              {/* Upload Button */}
              <div className="mb-4">
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading || uploadedImages.length >= 5}
                  />
                  <div className="flex items-center gap-2 text-gray-600">
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span>Đang upload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Chọn ảnh từ máy tính</span>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Image Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-5 gap-3">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {uploadedImages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="text-sm">Chưa có ảnh nào</p>
                </div>
              )}
            </div>

            {/* Sizes */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <label className="font-medium text-gray-700">Size & Số lượng</label>
                <button
                  type="button"
                  onClick={addSizeField}
                  className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  + Thêm size
                </button>
              </div>
              
              {formData.sizes.map((sizeItem, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  <input
                    type="number"
                    placeholder="Size (VD: 39)"
                    value={sizeItem.size}
                    onChange={(e) => updateSize(index, 'size', e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Số lượng"
                    value={sizeItem.stock}
                    onChange={(e) => updateSize(index, 'stock', e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeField(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end pt-4">
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
                disabled={uploading}
              >
                {editingProduct ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thương hiệu</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.images?.[0] && (
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.description?.substring(0, 50)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{product.price?.toLocaleString()}đ</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {product.category || 'Chưa phân loại'}
                  </span>
                  {product.gender && product.gender !== 'unisex' && (
                    <span className="ml-1 inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                      {product.gender}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {product.brand?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, productId: product._id })}
                    className="text-red-600 hover:text-red-800"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa sản phẩm này?"
        type="danger"
      />
    </div>
  );
}