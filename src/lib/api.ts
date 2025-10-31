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
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired, invalid, or forbidden
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('company')
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

  async matchPayment(paymentId: string, invoiceId: string | null) {
    const response = await api.patch(`/payments/${paymentId}/match`, { invoiceId })
    return response.data
  },

  async getPaymentSuggestions(paymentId: string) {
    const response = await api.get(`/payments/${paymentId}/suggestions`)
    return response.data
  },

  // Payment Imports
  async importPayments(payments: any[]) {
    const response = await api.post('/payments/import', { payments })
    return response.data
  },

  async importPaymentsCSV(csvData: string) {
    const response = await api.post('/payments/import/csv', { csvData })
    return response.data
  },

  async importPaymentsMT940(mt940Data: string) {
    const response = await api.post('/payments/import/mt940', { mt940Data })
    return response.data
  },

  async importPaymentsCAMT053(camt053Data: string) {
    const response = await api.post('/payments/import/camt053', { camt053Data })
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

  // Quote API calls
  async getQuotes(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
    customerId?: string
    startDate?: string
    endDate?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.customerId) queryParams.append('customerId', params.customerId)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)
    
    const response = await api.get(`/quotes?${queryParams.toString()}`)
    return response.data
  },

  async getQuote(id: string) {
    const response = await api.get(`/quotes/${id}`)
    return response.data
  },

  async createQuote(quoteData: any) {
    const response = await api.post('/quotes', quoteData)
    return response.data
  },

  async updateQuote(id: string, quoteData: any) {
    const response = await api.put(`/quotes/${id}`, quoteData)
    return response.data
  },

  async updateQuoteStatus(id: string, status: string) {
    const response = await api.patch(`/quotes/${id}/status`, { status })
    return response.data
  },

  async sendQuoteEmail(id: string) {
    const response = await api.post(`/quotes/${id}/send`)
    return response.data
  },

  // Public quote acceptance endpoints (no auth required)
  async getQuoteByToken(token: string) {
    // Use a separate axios instance without auth interceptor for public endpoints
    const publicApi = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const response = await publicApi.get(`/quotes/token/${token}`)
    return response.data
  },

  async acceptQuote(token: string, customerEmail?: string) {
    // Use a separate axios instance without auth interceptor for public endpoints
    const publicApi = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const response = await publicApi.post(`/quotes/accept/${token}`, {
      customerEmail
    })
    return response.data
  },

  async regenerateQuoteAcceptanceLink(quoteId: string) {
    const response = await api.post(`/quotes/${quoteId}/regenerate-link`)
    return response.data
  },

  // Users & Invitations
  async getUsers() {
    const response = await api.get('/users')
    return response.data
  },

  async inviteUser(email: string, name: string, role: 'ADMIN' | 'EMPLOYEE' = 'EMPLOYEE') {
    const response = await api.post('/users/invite', { email, name, role })
    return response.data
  },

  async updateUserRole(userId: string, role: 'ADMIN' | 'EMPLOYEE') {
    const response = await api.patch(`/users/${userId}/role`, { role })
    return response.data
  },

  async deactivateUser(userId: string) {
    const response = await api.patch(`/users/${userId}/deactivate`)
    return response.data
  },

  async reactivateUser(userId: string) {
    const response = await api.patch(`/users/${userId}/reactivate`)
    return response.data
  },

  // Invitations (public for acceptance)
  async getInvitationByToken(token: string) {
    const publicApi = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const response = await publicApi.get(`/invitations/${token}`)
    return response.data
  },

  async acceptInvitation(token: string, password: string, name?: string) {
    const publicApi = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const response = await publicApi.post(`/invitations/${token}/accept`, { password, name })
    return response.data
  },

  // Invitations (admin only)
  async getInvitations() {
    const response = await api.get('/invitations')
    return response.data
  },

  async cancelInvitation(invitationId: string) {
    const response = await api.delete(`/invitations/${invitationId}`)
    return response.data
  },

  // Permissions (admin only)
  async getPermissions() {
    const response = await api.get('/permissions')
    return response.data
  },

  async getRolePermissions(role: 'ADMIN' | 'EMPLOYEE') {
    const response = await api.get(`/permissions/roles/${role}`)
    return response.data
  },

  async updateRolePermissions(role: 'ADMIN' | 'EMPLOYEE', permissions: Record<string, boolean>) {
    const response = await api.put(`/permissions/roles/${role}`, { permissions })
    return response.data
  },

  async resetRolePermissions(role: 'ADMIN' | 'EMPLOYEE') {
    const response = await api.post(`/permissions/roles/${role}/reset`)
    return response.data
  },

  async deleteQuote(id: string) {
    const response = await api.delete(`/quotes/${id}`)
    return response.data
  },

  // Expenses
  async getExpenses(params?: {
    page?: number
    limit?: number
    category?: string
    status?: string
    startDate?: string
    endDate?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    const response = await api.get('/expenses', { params })
    return response.data
  },

  async getExpense(id: string) {
    const response = await api.get(`/expenses/${id}`)
    return response.data
  },

  async createExpense(expenseData: any) {
    const response = await api.post('/expenses', expenseData)
    return response.data
  },

  async updateExpense(id: string, expenseData: any) {
    const response = await api.put(`/expenses/${id}`, expenseData)
    return response.data
  },

  async deleteExpense(id: string) {
    const response = await api.delete(`/expenses/${id}`)
    return response.data
  },

  async uploadExpenseFiles(id: string, files: File[]) {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    const response = await api.post(`/expenses/${id}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async deleteExpenseFile(expenseId: string, fileId: string) {
    const response = await api.delete(`/expenses/${expenseId}/files/${fileId}`)
    return response.data
  },

  async getExpenseCategories() {
    const response = await api.get('/expenses/categories')
    return response.data
  },

  async getExpenseStats(period?: 'month' | 'year') {
    const response = await api.get('/expenses/stats', { params: { period } })
    return response.data
  },

  async exportExpenses(startDate: string, endDate: string) {
    const response = await api.post(
      '/expenses/export',
      { startDate, endDate },
      { responseType: 'blob' } // Important for binary data
    )
    return response.data
  },

  // Company
  async getCompany() {
    const response = await api.get('/company')
    return response.data
  },

  async uploadLogo(file: File) {
    const formData = new FormData()
    formData.append('logo', file)
    const response = await api.post('/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async deleteLogo() {
    const response = await api.delete('/company/logo')
    return response.data
  },

}

export default api




