import { apiClient } from '../lib/api'

export interface ExportFilters {
  status?: string
  customerId?: string
  startDate?: string
  endDate?: string
  isMatched?: boolean
  isActive?: boolean
}

// Helper function to perform export
const performExport = async (
  endpoint: string,
  filters: ExportFilters,
  format: 'csv' | 'pdf',
  entityName: string
) => {
  try {
    const queryParams = new URLSearchParams()
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    const token = localStorage.getItem('authToken')
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
    const response = await fetch(
      `${baseUrl}/export/${endpoint}/${format}?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Export failed')
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition')
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `${entityName}_export_${new Date().toISOString().split('T')[0]}.${format}`

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    return { success: true }
  } catch (error) {
    console.error('Export error:', error)
    return { success: false, error: `Failed to export ${entityName}` }
  }
}

export const exportInvoices = async (filters: ExportFilters = {}, format: 'csv' | 'pdf' = 'csv') => {
  return performExport('invoices', filters, format, 'invoices')
}

export const exportQuotes = async (filters: ExportFilters = {}, format: 'csv' | 'pdf' = 'csv') => {
  return performExport('quotes', filters, format, 'quotes')
}

export const exportPayments = async (filters: ExportFilters = {}, format: 'csv' | 'pdf' = 'csv') => {
  return performExport('payments', filters, format, 'payments')
}

export const exportCustomers = async (filters: ExportFilters = {}, format: 'csv' | 'pdf' = 'csv') => {
  return performExport('customers', filters, format, 'customers')
}
