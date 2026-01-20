import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL + '/api/upload'

export const uploadAPI = {
  // Upload 1 ảnh
  uploadSingle: async (file) => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await axios.post(`${API_URL}/single`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Upload nhiều ảnh
  uploadMultiple: async (files) => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('images', file)
    })

    const response = await axios.post(`${API_URL}/multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}
