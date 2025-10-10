import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'

// Define types inline
interface DashboardStats {
  totalRevenue: number
  outstandingInvoices: number
  newCustomers: number
  quotesSent: number
  recentActivity: any[]
  overdueInvoices: any[]
}

interface UseDashboardReturn {
  stats: DashboardStats | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.getDashboardStats()

      if (response.success) {
        setStats(response.data)
      } else {
        setError(response.error || 'Failed to fetch dashboard stats')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchStats()
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch
  }
}


