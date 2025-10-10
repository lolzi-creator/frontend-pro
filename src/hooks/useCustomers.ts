import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'

// Define types inline
interface Customer {
  id: string
  companyId: string
  customerNumber: string
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

interface UseCustomersParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface UseCustomersReturn {
  customers: Customer[]
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  totalCount: number
  refetch: () => void
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>
  deleteCustomer: (id: string) => Promise<void>
}

export const useCustomers = (params: UseCustomersParams = {}): UseCustomersReturn => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(params.page || 1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.getCustomers({
        page: currentPage,
        limit: params.limit || 10,
        search: params.search,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder
      })

      if (response.success) {
        setCustomers(response.data.customers || [])
        setTotalPages(response.data.totalPages || 0)
        setTotalCount(response.data.totalCount || 0)
      } else {
        setError(response.error || 'Failed to fetch customers')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    try {
      const response = await apiClient.updateCustomer(id, data)
      if (response.success) {
        setCustomers(prev => prev.map(customer => 
          customer.id === id ? { ...customer, ...data } : customer
        ))
      } else {
        throw new Error(response.error || 'Failed to update customer')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer')
      throw err
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      const response = await apiClient.deleteCustomer(id)
      if (response.success) {
        setCustomers(prev => prev.filter(customer => customer.id !== id))
        setTotalCount(prev => prev - 1)
      } else {
        throw new Error(response.error || 'Failed to delete customer')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer')
      throw err
    }
  }

  const refetch = () => {
    fetchCustomers()
  }

  useEffect(() => {
    fetchCustomers()
  }, [currentPage, params.search, params.sortBy, params.sortOrder])

  return {
    customers,
    loading,
    error,
    totalPages,
    currentPage,
    totalCount,
    refetch,
    updateCustomer,
    deleteCustomer
  }
}


