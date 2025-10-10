import { useState, useEffect } from 'react'
import type { DashboardData, KPIMetric, PaymentPattern, RevenueForecast } from '../types'

export const useEnhancedDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock enhanced dashboard data
      const mockData: DashboardData = {
        kpis: [
          {
            id: 'revenue',
            title: 'Total Revenue',
            value: 125000,
            previousValue: 98000,
            change: 27.6,
            changeType: 'increase',
            format: 'currency',
            trend: 'up',
            icon: '💰',
            color: '#10b981'
          },
          {
            id: 'invoices',
            title: 'Invoices Sent',
            value: 45,
            previousValue: 38,
            change: 18.4,
            changeType: 'increase',
            format: 'number',
            trend: 'up',
            icon: '📄',
            color: '#3b82f6'
          },
          {
            id: 'payments',
            title: 'Payments Received',
            value: 38,
            previousValue: 35,
            change: 8.6,
            changeType: 'increase',
            format: 'number',
            trend: 'up',
            icon: '💳',
            color: '#8b5cf6'
          },
          {
            id: 'customers',
            title: 'Active Customers',
            value: 127,
            previousValue: 115,
            change: 10.4,
            changeType: 'increase',
            format: 'number',
            trend: 'up',
            icon: '👥',
            color: '#f59e0b'
          },
          {
            id: 'overdue',
            title: 'Overdue Invoices',
            value: 7,
            previousValue: 12,
            change: -41.7,
            changeType: 'decrease',
            format: 'number',
            trend: 'down',
            icon: '⚠️',
            color: '#ef4444'
          },
          {
            id: 'avg_invoice',
            title: 'Avg Invoice Value',
            value: 2777,
            previousValue: 2579,
            change: 7.7,
            changeType: 'increase',
            format: 'currency',
            trend: 'up',
            icon: '📊',
            color: '#06b6d4'
          }
        ],
        revenueData: [
          { x: 'Jan', y: 8500 },
          { x: 'Feb', y: 9200 },
          { x: 'Mar', y: 10800 },
          { x: 'Apr', y: 12400 },
          { x: 'May', y: 15200 },
          { x: 'Jun', y: 16800 },
          { x: 'Jul', y: 18900 },
          { x: 'Aug', y: 20100 },
          { x: 'Sep', y: 22300 },
          { x: 'Oct', y: 24100 },
          { x: 'Nov', y: 25800 },
          { x: 'Dec', y: 27500 }
        ],
        paymentPatterns: [
          {
            method: 'Bank Transfer',
            count: 28,
            amount: 85000,
            percentage: 68,
            trend: 'up'
          },
          {
            method: 'Credit Card',
            count: 12,
            amount: 25000,
            percentage: 20,
            trend: 'stable'
          },
          {
            method: 'PayPal',
            count: 8,
            amount: 12000,
            percentage: 10,
            trend: 'down'
          },
          {
            method: 'Cash',
            count: 3,
            amount: 3000,
            percentage: 2,
            trend: 'stable'
          }
        ],
        forecast: [
          { period: 'Jan 2025', actual: 0, forecast: 29000, confidence: 0.85 },
          { period: 'Feb 2025', actual: 0, forecast: 31500, confidence: 0.82 },
          { period: 'Mar 2025', actual: 0, forecast: 34000, confidence: 0.78 },
          { period: 'Apr 2025', actual: 0, forecast: 36500, confidence: 0.75 },
          { period: 'May 2025', actual: 0, forecast: 39000, confidence: 0.72 },
          { period: 'Jun 2025', actual: 0, forecast: 41500, confidence: 0.68 }
        ],
        recentActivity: [
          { id: 1, type: 'invoice', message: 'Invoice #INV-2024-045 sent to Acme Corp', time: '2 hours ago' },
          { id: 2, type: 'payment', message: 'Payment of CHF 2,500 received from TechStart AG', time: '4 hours ago' },
          { id: 3, type: 'quote', message: 'Quote #Q-2024-012 accepted by Global Solutions', time: '1 day ago' },
          { id: 4, type: 'customer', message: 'New customer "Innovation Labs" added', time: '2 days ago' }
        ],
        overdueInvoices: [
          { id: 1, number: 'INV-2024-038', customer: 'Delayed Corp', amount: 3500, daysOverdue: 15 },
          { id: 2, number: 'INV-2024-041', customer: 'Slow Pay Ltd', amount: 2800, daysOverdue: 8 },
          { id: 3, number: 'INV-2024-043', customer: 'Budget Inc', amount: 4200, daysOverdue: 5 }
        ],
        topCustomers: [
          { id: 1, name: 'Acme Corp', revenue: 25000, invoices: 8, lastPayment: '2024-11-15' },
          { id: 2, name: 'TechStart AG', revenue: 18500, invoices: 6, lastPayment: '2024-11-14' },
          { id: 3, name: 'Global Solutions', revenue: 15200, invoices: 5, lastPayment: '2024-11-13' }
        ],
        widgets: []
      }
      
      setData(mockData)
      setError(null)
    } catch (err) {
      setError('Failed to load dashboard data')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchDashboardData()
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    data,
    loading,
    error,
    refetch
  }
}
