import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import TouchButton from '../components/TouchButton'
import DataTable from '../components/DataTable'
import CompactMobileTable from '../components/CompactMobileTable'
import AdvancedFilters from '../components/AdvancedFilters'

// Define Quote interface inline
interface Quote {
  id: string
  number: string
  customerId: string
  customer: {
    id: string
    name: string
    company?: string
    email?: string
  }
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  date: string
  validUntil: string
  subtotal: number
  vatRate: number
  vatAmount: number
  total: number
  currency: string
  notes?: string
  createdAt: string
  updatedAt: string
  items: any[]
}

const Quotes: React.FC = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // TODO: Replace with real API call when quotes API is available
  React.useEffect(() => {
    // Simulate API call
    const fetchQuotes = async () => {
      setLoading(true)
      try {
        // This would be replaced with actual API call
        // const response = await apiClient.getQuotes()
        // setQuotes(response.data)
        
        // For now, show empty state
        setQuotes([])
        setError(null)
      } catch (err) {
        setError('Failed to load quotes')
        setQuotes([])
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-success-100 text-success-800'
      case 'SENT':
        return 'bg-accent-100 text-accent-800'
      case 'DRAFT':
        return 'bg-neutral-100 text-neutral-800'
      case 'REJECTED':
        return 'bg-error-100 text-error-800'
      case 'EXPIRED':
        return 'bg-warning-100 text-warning-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getStatusIcon = (status: Quote['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'SENT':
        return (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )
      case 'DRAFT':
        return (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'REJECTED':
        return (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'EXPIRED':
        return (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8 h-full overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quotes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8 h-full overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 mb-2">Failed to load quotes</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto">
      {/* Page Header */}
      <div className="mb-4 lg:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1" style={{fontFamily: 'Poppins'}}>
              Quotes
            </h2>
            <p className="text-gray-600 text-sm">
              Create and manage your quotes
            </p>
          </div>
          <TouchButton
            variant="primary"
            size="md"
            fullWidth
            className="sm:w-auto"
            onClick={() => console.log('New Quote clicked')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Quote
          </TouchButton>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={[
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'DRAFT', label: 'Draft' },
              { value: 'SENT', label: 'Sent' },
              { value: 'ACCEPTED', label: 'Accepted' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'EXPIRED', label: 'Expired' },
            ]
          },
          {
            key: 'amount',
            label: 'Amount',
            type: 'number',
            placeholder: 'Filter by amount'
          },
          {
            key: 'validUntil',
            label: 'Valid Until',
            type: 'dateRange'
          },
          {
            key: 'customer',
            label: 'Customer',
            type: 'text',
            placeholder: 'Search by customer name'
          }
        ]}
        onApplyFilters={setFilters}
        onClearFilters={() => setFilters({})}
      />

      {/* Empty State */}
      {quotes.length === 0 && !loading && !error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first quote</p>
            <TouchButton
              variant="primary"
              onClick={() => console.log('Create first quote')}
            >
              Create Quote
            </TouchButton>
          </div>
        </div>
      )}

      {/* Compact Mobile Table */}
      {quotes.length > 0 && (
        <div className="block lg:hidden">
          <CompactMobileTable
            data={quotes}
            columns={[
              {
                key: 'number',
                label: 'Quote #',
                sortable: true,
                priority: 'high',
                render: (value) => (
                  <span className="font-medium text-gray-900">{value}</span>
                ),
                mobileRender: (row) => (
                  <div>
                    <span className="font-medium text-gray-900">{row.number}</span>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.status)}`}>
                      {getStatusIcon(row.status)}
                      <span className="ml-1 capitalize">{row.status.toLowerCase()}</span>
                    </span>
                  </div>
                )
              },
              {
                key: 'customer',
                label: 'Customer',
                sortable: true,
                priority: 'high',
                render: (value, row) => (
                  <span className="text-gray-900">{row.customer?.name || 'N/A'}</span>
                )
              },
              {
                key: 'total',
                label: 'Amount',
                sortable: true,
                priority: 'high',
                render: (value, row) => (
                  <span className="font-medium text-gray-900">{row.currency} {value?.toFixed(2) || '0.00'}</span>
                )
              },
              {
                key: 'status',
                label: 'Status',
                sortable: true,
                priority: 'medium',
                render: (value) => (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}>
                    {getStatusIcon(value)}
                    <span className="ml-1 capitalize">{value.toLowerCase()}</span>
                  </span>
                )
              },
              {
                key: 'validUntil',
                label: 'Valid Until',
                sortable: true,
                priority: 'medium',
                render: (value) => (
                  <span className="text-gray-600">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
                )
              },
              {
                key: 'actions' as any,
                label: 'Actions',
                render: (_, row) => (
                  <div className="flex items-center space-x-2">
                    <TouchButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/quotes/${row.id}`)
                      }}
                    >
                      View
                    </TouchButton>
                    <TouchButton
                      variant="primary"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </TouchButton>
                  </div>
                )
              }
            ]}
            title="Quote List"
            searchable={true}
            searchPlaceholder="Search quotes..."
            pagination={true}
            pageSize={8}
            bulkActions={true}
            onBulkAction={(action, selectedRows) => {
              console.log('Bulk action:', action, selectedRows)
            }}
            onRowClick={(row) => navigate(`/quotes/${row.id}`)}
          />
        </div>
      )}

      {/* Desktop Table */}
      {quotes.length > 0 && (
        <div className="hidden lg:block">
          <DataTable
            data={quotes}
            columns={[
              {
                key: 'number',
                label: 'Quote #',
                sortable: true,
                render: (value) => (
                  <span className="font-medium text-gray-900">{value}</span>
                )
              },
              {
                key: 'customer',
                label: 'Customer',
                sortable: true,
                render: (value, row) => (
                  <span className="text-gray-900">{row.customer?.name || 'N/A'}</span>
                )
              },
              {
                key: 'total',
                label: 'Amount',
                sortable: true,
                render: (value, row) => (
                  <span className="font-medium text-gray-900">{row.currency} {value?.toFixed(2) || '0.00'}</span>
                )
              },
              {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (value) => (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}>
                    {getStatusIcon(value)}
                    <span className="ml-1 capitalize">{value.toLowerCase()}</span>
                  </span>
                )
              },
              {
                key: 'validUntil',
                label: 'Valid Until',
                sortable: true,
                render: (value) => (
                  <span className="text-gray-600">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
                )
              },
              {
                key: 'actions' as any,
                label: 'Actions',
                render: (_, row) => (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/quotes/${row.id}`)
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Button>
                  </div>
                )
              }
            ]}
            title="Quote List"
            searchable={true}
            searchPlaceholder="Search quotes..."
            pagination={true}
            pageSize={10}
            bulkActions={true}
            onBulkAction={(action, selectedRows) => {
              console.log('Bulk action:', action, selectedRows)
            }}
            onRowClick={(row) => navigate(`/quotes/${row.id}`)}
          />
        </div>
      )}
    </div>
  )
}

export default Quotes




