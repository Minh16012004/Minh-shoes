import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL + '/api/cart'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export const cartAPI = {
  getCart: () => axios.get(API_URL, getAuthHeaders()),

  addToCart: (productId, quantity, size) =>
    axios.post(
      `${API_URL}/add`,
      { productId, quantity, size },
      getAuthHeaders()
    ),

  updateItem: (itemId, quantity) =>
    axios.put(
      `${API_URL}/update`,
      { itemId, quantity },
      getAuthHeaders()
    ),

  removeItem: (itemId) =>
    axios.delete(`${API_URL}/remove/${itemId}`, getAuthHeaders()),

  clearCart: () =>
    axios.delete(`${API_URL}/clear`, getAuthHeaders())
}
