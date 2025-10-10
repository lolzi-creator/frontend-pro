import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'

// Define types inline like the old frontend
interface Invoice {
  id: string
  number: string
  customerId: string
  customer: {
    id: string
    name: string
    company?: string
    email?: string
    address: string
    zip: string
    city: string
    country: string
    phone?: string
    vatNumber?: string
    paymentTerms: number
    creditLimit?: number
    isActive: boolean
    notes?: string
    language: string
    createdAt: string
    updatedAt: string
  }
  company: {
    id: string
    name: string
    address: string
    zip: string
    city: string
    country: string
    phone?: string
    email?: string
    website?: string
    vatNumber?: string
    iban?: string
    bankName?: string
    bankAddress?: string
    logoUrl?: string
    createdAt: string
    updatedAt: string
  }
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  date: string
  dueDate: string
  subtotal: number
  vatRate: number
  vatAmount: number
  total: number
  currency: string
  notes?: string
  qrReference?: string
  paymentMethod?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
  items: InvoiceItem[]
}

interface InvoiceItem {
  id: string
  invoiceId: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  vatRate: number
  vatAmount: number
  createdAt: string
  updatedAt: string
}

interface UseInvoicesParams {
  page?: number
  limit?: number
  status?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface UseInvoicesReturn {
  invoices: Invoice[]
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  totalCount: number
  refetch: () => void
  updateInvoice: (id: string, data: Partial<Invoice>) => Promise<void>
  deleteInvoice: (id: string) => Promise<void>
  updateInvoiceStatus: (id: string, status: string) => Promise<void>
}

export const useInvoices = (params: UseInvoicesParams = {}): UseInvoicesReturn => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(params.page || 1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.getInvoices({
        page: currentPage,
        limit: params.limit || 10,
        status: params.status,
        search: params.search,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder
      })

      if (response.success) {
        setInvoices(response.data.invoices || [])
        setTotalPages(response.data.totalPages || 0)
        setTotalCount(response.data.totalCount || 0)
      } else {
        setError(response.error || 'Failed to fetch invoices')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching invoices:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateInvoice = async (id: string, data: Partial<Invoice>) => {
    try {
      const response = await apiClient.updateInvoice(id, data)
      if (response.success) {
        // Update the invoice in the local state
        setInvoices(prev => prev.map(invoice => 
          invoice.id === id ? { ...invoice, ...data } : invoice
        ))
      } else {
        throw new Error(response.error || 'Failed to update invoice')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update invoice')
      throw err
    }
  }

  const deleteInvoice = async (id: string) => {
    try {
      const response = await apiClient.deleteInvoice(id)
      if (response.success) {
        setInvoices(prev => prev.filter(invoice => invoice.id !== id))
        setTotalCount(prev => prev - 1)
      } else {
        throw new Error(response.error || 'Failed to delete invoice')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete invoice')
      throw err
    }
  }

  const updateInvoiceStatus = async (id: string, status: string) => {
    try {
      const response = await apiClient.updateInvoiceStatus(id, status)
      if (response.success) {
        setInvoices(prev => prev.map(invoice => 
          invoice.id === id ? { ...invoice, status: status as any } : invoice
        ))
      } else {
        throw new Error(response.error || 'Failed to update invoice status')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update invoice status')
      throw err
    }
  }

  const refetch = () => {
    fetchInvoices()
  }

  useEffect(() => {
    fetchInvoices()
  }, [currentPage, params.status, params.search, params.sortBy, params.sortOrder])

  return {
    invoices,
    loading,
    error,
    totalPages,
    currentPage,
    totalCount,
    refetch,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus
  }
}


