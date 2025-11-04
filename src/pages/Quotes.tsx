import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
import { apiClient } from '../lib/api'
import Button from '../components/Button'
import TouchButton from '../components/TouchButton'
import DataTable from '../components/DataTable'
import CompactMobileTable from '../components/CompactMobileTable'
import AdvancedFilters from '../components/AdvancedFilters'
import ConfirmationModal from '../components/ConfirmationModal'
import QuoteModal from '../components/QuoteModal'
import { TableSkeleton, Alert, LoadingSpinner } from '../components'

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
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const { t } = useLanguage()
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; quote: any }>({
    isOpen: false,
    quote: null
  })
  const [quoteModal, setQuoteModal] = useState(false)

  React.useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true)
      try {
        const response = await apiClient.getQuotes()
        if (response.success) {
          setQuotes(response.data.quotes || [])
        } else {
          setError(t.quote.failedToLoad)
        }
      } catch (err) {
        console.error('Error fetching quotes:', err)
        setError(t.quote.failedToLoad || 'Failed to load quotes')
        setQuotes([])
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  const handleDeleteQuote = async (quote: any) => {
    try {
      const response = await apiClient.deleteQuote(quote.id)
      
      if (response.success) {
        // Remove from local state
        setQuotes(prev => prev.filter(q => q.id !== quote.id))
        showSuccess(t.quote.quoteDeleted, `${t.quote.number} #${quote.number} ${t.common.success.toLowerCase()}.`)
      } else {
        showError(t.common.error, t.common.error)
      }
    } catch (error) {
      console.error('Error deleting quote:', error)
      showError(t.common.error, t.common.error)
    }
  }

  const handleStatusChange = async (quote: any, newStatus: string) => {
    try {
      const response = await apiClient.updateQuoteStatus(quote.id, newStatus)
      
      if (response.success) {
        // Update local state
        setQuotes(prev => prev.map(q => 
          q.id === quote.id ? { ...q, status: newStatus as any } : q
        ))
        showSuccess(t.quote.statusUpdated || 'Status Updated', `${t.quote.number} #${quote.number} ${t.quote.statusUpdatedTo || 'status updated to'} ${newStatus}.`)
      } else {
        showError(t.quote.updateFailed || 'Update Failed', response.error || t.quote.failedToUpdateStatus || 'Failed to update quote status. Please try again.')
      }
    } catch (error) {
      console.error('Error updating quote status:', error)
      showError(t.quote.updateFailed || 'Update Failed', t.quote.failedToUpdateStatus || 'Failed to update quote status. Please try again.')
    }
  }

  const handleCreateQuote = () => {
    navigate('/quotes/create')
  }

  const handleQuoteCreated = (quoteData: any) => {
    console.log('Quote created:', quoteData)
    // Add to local state
    setQuotes(prev => [...prev, { ...quoteData, id: Date.now().toString() }])
    showSuccess(t.quote.quoteCreated, t.quote.quoteCreatedSuccess || 'Quote has been created successfully.')
  }

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
        {/* Page Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="mb-6">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <TableSkeleton rows={5} columns={6} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8 h-full overflow-y-auto">
        <Alert
          type="error"
          title={t.quote.failedToLoad}
          message={error}
          onClose={() => window.location.reload()}
        >
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t.quote.tryAgain}
          </button>
        </Alert>
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
              {t.quote.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {t.quote.subtitle}
            </p>
          </div>
          <TouchButton
            variant="primary"
            size="md"
            fullWidth
            className="sm:w-auto"
            onClick={handleCreateQuote}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t.quote.newQuote}
          </TouchButton>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={[
          {
            key: 'status',
            label: t.quote.status,
            type: 'select',
            options: [
              { value: 'DRAFT', label: t.quote.draft },
              { value: 'SENT', label: t.quote.sent },
              { value: 'ACCEPTED', label: t.quote.accepted },
              { value: 'REJECTED', label: t.quote.rejected },
              { value: 'EXPIRED', label: t.quote.expired },
            ]
          },
          {
            key: 'amount',
            label: t.quote.amount,
            type: 'number',
            placeholder: t.quote.filterByAmount || 'Filter by amount'
          },
          {
            key: 'validUntil',
            label: t.quote.expiryDate,
            type: 'dateRange'
          },
          {
            key: 'customer',
            label: t.quote.customer,
            type: 'text',
            placeholder: t.quote.searchByCustomer || 'Search by customer name'
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t.quote.noQuotesYet || 'No quotes yet'}</h3>
            <p className="text-gray-600 mb-4">{t.quote.getStartedCreating || 'Get started by creating your first quote'}</p>
            <TouchButton
              variant="primary"
              onClick={handleCreateQuote}
            >
              {t.quote.create}
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
                label: `${t.quote.number} #`,
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
                label: t.quote.customer,
                sortable: true,
                priority: 'high',
                render: (value, row) => (
                  <span className="text-gray-900">{row.customer?.name || 'N/A'}</span>
                )
              },
              {
                key: 'total',
                label: t.quote.amount,
                sortable: true,
                priority: 'high',
                render: (value, row) => (
                  <span className="font-medium text-gray-900">{row.currency} {value?.toFixed(2) || '0.00'}</span>
                )
              },
              {
                key: 'status',
                label: t.quote.status,
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
                label: t.quote.expiryDate,
                sortable: true,
                priority: 'medium',
                render: (value) => (
                  <span className="text-gray-600">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
                )
              },
              {
                key: 'actions' as any,
                label: t.quote.actions,
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
                      {t.quote.view}
                    </TouchButton>
                    <TouchButton
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/quotes/${row.id}/edit`)
                      }}
                    >
                      {t.quote.edit}
                    </TouchButton>
                    <TouchButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteModal({ isOpen: true, quote: row })
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {t.common.delete}
                    </TouchButton>
                  </div>
                )
              }
            ]}
            title={t.quote.title}
            searchable={true}
            searchPlaceholder={t.quote.searchPlaceholder || 'Search quotes...'}
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
                label: `${t.quote.number} #`,
                sortable: true,
                render: (value) => (
                  <span className="font-medium text-gray-900">{value}</span>
                )
              },
              {
                key: 'customer',
                label: t.quote.customer,
                sortable: true,
                render: (value, row) => (
                  <span className="text-gray-900">{row.customer?.name || 'N/A'}</span>
                )
              },
              {
                key: 'total',
                label: t.quote.amount,
                sortable: true,
                render: (value, row) => (
                  <span className="font-medium text-gray-900">{row.currency} {value?.toFixed(2) || '0.00'}</span>
                )
              },
              {
                key: 'status',
                label: t.quote.status,
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
                label: t.quote.expiryDate,
                sortable: true,
                render: (value) => (
                  <span className="text-gray-600">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
                )
              },
              {
                key: 'actions' as any,
                label: t.quote.actions,
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
                      {t.quote.view}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/quotes/${row.id}/edit`)
                      }}
                    >
                      {t.quote.edit}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteModal({ isOpen: true, quote: row })
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {t.common.delete}
                    </Button>
                  </div>
                )
              }
            ]}
            title={t.quote.title}
            searchable={true}
            searchPlaceholder={t.quote.searchPlaceholder || 'Search quotes...'}
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

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, quote: null })}
        onConfirm={() => {
          handleDeleteQuote(deleteModal.quote)
          setDeleteModal({ isOpen: false, quote: null })
        }}
        title={t.quote.delete}
        message={t.quote.deleteConfirmation?.replace('{{number}}', deleteModal.quote?.number || '') || `Are you sure you want to delete quote #${deleteModal.quote?.number}? This action cannot be undone.`}
        confirmText={t.common.delete}
        cancelText={t.common.cancel}
        type="danger"
      />

      <QuoteModal
        isOpen={quoteModal}
        onClose={() => setQuoteModal(false)}
        onSave={handleQuoteCreated}
      />
    </div>
  )
}

export default Quotes








