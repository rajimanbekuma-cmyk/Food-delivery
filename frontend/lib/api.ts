import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
}

// Restaurant API
export const restaurantAPI = {
  getAll: (params?: any) => api.get('/restaurants', { params }),
  getById: (id: string) => api.get(`/restaurants/${id}`),
  create: (data: any) => api.post('/restaurants', data),
  update: (id: string, data: any) => api.put(`/restaurants/${id}`, data),
}

// Menu API
export const menuAPI = {
  getByRestaurant: (restaurantId: string, params?: any) =>
    api.get(`/menu/restaurant/${restaurantId}`, { params }),
  getById: (id: string) => api.get(`/menu/${id}`),
  create: (data: any) => api.post('/menu', data),
  update: (id: string, data: any) => api.put(`/menu/${id}`, data),
  delete: (id: string) => api.delete(`/menu/${id}`),
}

// Order API
export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
  rate: (id: string, data: any) => api.post(`/orders/${id}/rating`, data),
}

// Driver API
export const driverAPI = {
  getAvailableOrders: () => api.get('/drivers/available-orders'),
  acceptOrder: (orderId: string) => api.post(`/drivers/accept-order/${orderId}`),
  getMyDeliveries: (params?: any) => api.get('/drivers/my-deliveries', { params }),
  getStats: () => api.get('/drivers/stats'),
}

// Admin API
export const adminAPI = {
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserStatus: (id: string, isActive: boolean) =>
    api.put(`/admin/users/${id}/status`, { isActive }),
  getAnalytics: (params?: any) => api.get('/admin/analytics', { params }),
  getRestaurants: () => api.get('/admin/restaurants'),
  getOrders: (params?: any) => api.get('/admin/orders', { params }),
}

// Payment API
export const paymentAPI = {
  createIntent: (orderId: string) => api.post('/payments/create-intent', { orderId }),
  addToWallet: (amount: number) => api.post('/payments/wallet/add', { amount }),
}

