import axios from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Functions
export const apiClient = {
  // Auth
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(userData: any) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async getProfile() {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Invoices
  async getInvoices(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    const response = await api.get('/invoices', { params })
    return response.data
  },

  async getInvoice(id: string) {
    const response = await api.get(`/invoices/${id}`)
    return response.data
  },

  async createInvoice(invoiceData: any) {
    const response = await api.post('/invoices', invoiceData)
    return response.data
  },

  async updateInvoice(id: string, invoiceData: any) {
    const response = await api.put(`/invoices/${id}`, invoiceData)
    return response.data
  },

  async deleteInvoice(id: string) {
    const response = await api.delete(`/invoices/${id}`)
    return response.data
  },

  async updateInvoiceStatus(id: string, status: string) {
    const response = await api.patch(`/invoices/${id}/status`, { status })
    return response.data
  },

  async getInvoiceStats() {
    const response = await api.get('/invoices/stats')
    return response.data
  },

  // Customers
  async getCustomers(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    const response = await api.get('/customers', { params })
    return response.data
  },

  async getCustomer(id: string) {
    const response = await api.get(`/customers/${id}`)
    return response.data
  },

  async createCustomer(customerData: any) {
    const response = await api.post('/customers', customerData)
    return response.data
  },

  async updateCustomer(id: string, customerData: any) {
    const response = await api.put(`/customers/${id}`, customerData)
    return response.data
  },

  async deleteCustomer(id: string) {
    const response = await api.delete(`/customers/${id}`)
    return response.data
  },

  // Payments
  async getPayments(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    const response = await api.get('/payments', { params })
    return response.data
  },

  async getPayment(id: string) {
    const response = await api.get(`/payments/${id}`)
    return response.data
  },

  async createPayment(paymentData: any) {
    const response = await api.post('/payments', paymentData)
    return response.data
  },

  // Dashboard
  async getDashboardStats() {
    const response = await api.get('/invoices/stats')
    return response.data
  },

  // Health check
  async healthCheck() {
    const response = await api.get('/health')
    return response.data
  },

  // PDF Generation
  async downloadInvoicePDF(id: string) {
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob'
    })
    return response.data
  },

  // Send Email/Reminder
  async sendInvoiceReminder(id: string, level: number = 1) {
    const response = await api.post(`/invoices/${id}/reminder`, { level })
    return response.data
  },

}

export default api



