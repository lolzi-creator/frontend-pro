import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import TouchButton from '../components/TouchButton'
import DataTable from '../components/DataTable'
import CompactMobileTable from '../components/CompactMobileTable'
import AdvancedFilters from '../components/AdvancedFilters'

// Define Payment interface inline
interface Payment {
  id: string
  invoiceId?: string
  amount: number
  currency: string
  paymentMethod: string
  reference?: string
  notes?: string
  paidAt: string
  createdAt: string
  updatedAt: string
  invoice?: {
    id: string
    number: string
    customer: {
      name: string
    }
  }
}

const Payments: React.FC = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // TODO: Replace with real API call when payments API is available
  React.useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      try {
        // This would be replaced with actual API call
        // const response = await apiClient.getPayments()
        // setPayments(response.data)
        
        // For now, show empty state
        setPayments([])
        setError(null)
      } catch (err) {
        setError('Failed to load payments')
        setPayments([])
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank_transfer':
      case 'sepa':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      case 'credit_card':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      case 'cash':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V3m0 9v3m0-3H9m3 0h3m-6 6h6m-3 3v-3" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8 h-full overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payments...</p>
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
            <p className="text-red-600 mb-2">Failed to load payments</p>
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
              Payments
            </h2>
            <p className="text-gray-600 text-sm">
              Track and manage your payments
            </p>
          </div>
          <div className="flex space-x-2">
            <TouchButton
              variant="outline"
              size="md"
              onClick={() => console.log('Import payments clicked')}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Import
            </TouchButton>
            <TouchButton
              variant="primary"
              size="md"
              onClick={() => console.log('New Payment clicked')}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Payment
            </TouchButton>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={[
          {
            key: 'paymentMethod',
            label: 'Payment Method',
            type: 'select',
            options: [
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'credit_card', label: 'Credit Card' },
              { value: 'cash', label: 'Cash' },
              { value: 'sepa', label: 'SEPA' },
            ]
          },
          {
            key: 'amount',
            label: 'Amount',
            type: 'number',
            placeholder: 'Filter by amount'
          },
          {
            key: 'paidAt',
            label: 'Payment Date',
            type: 'dateRange'
          },
          {
            key: 'reference',
            label: 'Reference',
            type: 'text',
            placeholder: 'Search by reference'
          }
        ]}
        onApplyFilters={setFilters}
        onClearFilters={() => setFilters({})}
      />

      {/* Empty State */}
      {payments.length === 0 && !loading && !error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
            <p className="text-gray-600 mb-4">Start by importing payments or adding them manually</p>
            <div className="flex space-x-2 justify-center">
              <TouchButton
                variant="outline"
                onClick={() => console.log('Import payments')}
              >
                Import Payments
              </TouchButton>
              <TouchButton
                variant="primary"
                onClick={() => console.log('Add payment')}
              >
                Add Payment
              </TouchButton>
            </div>
          </div>
        </div>
      )}

      {/* Compact Mobile Table */}
      {payments.length > 0 && (
        <div className="block lg:hidden">
          <CompactMobileTable
            data={payments}
            columns={[
              {
                key: 'amount',
                label: 'Payment',
                sortable: true,
                priority: 'high',
                render: (value, row) => (
                  <div>
                    <span className="font-medium text-gray-900">{row.currency} {value?.toFixed(2) || '0.00'}</span>
                    <div className="text-sm text-gray-500">{row.paymentMethod}</div>
                  </div>
                ),
                mobileRender: (row) => (
                  <div>
                    <span className="font-medium text-gray-900">{row.currency} {row.amount?.toFixed(2) || '0.00'}</span>
                    <div className="text-sm text-gray-500 flex items-center">
                      {getPaymentMethodIcon(row.paymentMethod)}
                      <span className="ml-1 capitalize">{row.paymentMethod.replace('_', ' ')}</span>
                    </div>
                  </div>
                )
              },
              {
                key: 'invoice',
                label: 'Invoice',
                sortable: true,
                priority: 'high',
                render: (value, row) => (
                  <div>
                    {row.invoice ? (
                      <>
                        <span className="font-medium text-gray-900">{row.invoice.number}</span>
                        <div className="text-sm text-gray-500">{row.invoice.customer.name}</div>
                      </>
                    ) : (
                      <span className="text-gray-500">Unmatched</span>
                    )}
                  </div>
                )
              },
              {
                key: 'paidAt',
                label: 'Date',
                sortable: true,
                priority: 'medium',
                render: (value) => (
                  <span className="text-gray-600">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
                )
              },
              {
                key: 'reference',
                label: 'Reference',
                sortable: true,
                priority: 'low',
                render: (value) => (
                  <span className="text-gray-600 text-sm">{value || 'N/A'}</span>
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
                        navigate(`/payments/${row.id}`)
                      }}
                    >
                      View
                    </TouchButton>
                    <TouchButton
                      variant="primary"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Match
                    </TouchButton>
                  </div>
                )
              }
            ]}
            title="Payment List"
            searchable={true}
            searchPlaceholder="Search payments..."
            pagination={true}
            pageSize={8}
            bulkActions={true}
            onBulkAction={(action, selectedRows) => {
              console.log('Bulk action:', action, selectedRows)
            }}
            onRowClick={(row) => navigate(`/payments/${row.id}`)}
          />
        </div>
      )}

      {/* Desktop Table */}
      {payments.length > 0 && (
        <div className="hidden lg:block">
          <DataTable
            data={payments}
            columns={[
              {
                key: 'amount',
                label: 'Amount',
                sortable: true,
                render: (value, row) => (
                  <div className="flex items-center">
                    {getPaymentMethodIcon(row.paymentMethod)}
                    <span className="ml-2 font-medium text-gray-900">{row.currency} {value?.toFixed(2) || '0.00'}</span>
                  </div>
                )
              },
              {
                key: 'invoice',
                label: 'Invoice',
                sortable: true,
                render: (value, row) => (
                  <div>
                    {row.invoice ? (
                      <>
                        <span className="font-medium text-gray-900">{row.invoice.number}</span>
                        <div className="text-sm text-gray-500">{row.invoice.customer.name}</div>
                      </>
                    ) : (
                      <span className="text-gray-500">Unmatched</span>
                    )}
                  </div>
                )
              },
              {
                key: 'paymentMethod',
                label: 'Method',
                sortable: true,
                render: (value) => (
                  <span className="capitalize text-gray-600">{value.replace('_', ' ')}</span>
                )
              },
              {
                key: 'paidAt',
                label: 'Date',
                sortable: true,
                render: (value) => (
                  <span className="text-gray-600">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
                )
              },
              {
                key: 'reference',
                label: 'Reference',
                sortable: true,
                render: (value) => (
                  <span className="text-gray-600">{value || 'N/A'}</span>
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
                        navigate(`/payments/${row.id}`)
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Match
                    </Button>
                  </div>
                )
              }
            ]}
            title="Payment List"
            searchable={true}
            searchPlaceholder="Search payments..."
            pagination={true}
            pageSize={10}
            bulkActions={true}
            onBulkAction={(action, selectedRows) => {
              console.log('Bulk action:', action, selectedRows)
            }}
            onRowClick={(row) => navigate(`/payments/${row.id}`)}
          />
        </div>
      )}
    </div>
  )
}

export default Payments


