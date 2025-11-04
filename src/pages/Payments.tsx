import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
import Button from '../components/Button'
import TouchButton from '../components/TouchButton'
import DataTable from '../components/DataTable'
import CompactMobileTable from '../components/CompactMobileTable'
import AdvancedFilters from '../components/AdvancedFilters'
import ConfirmationModal from '../components/ConfirmationModal'
import PaymentImportModal from '../components/PaymentImportModal'
import PaymentModal from '../components/PaymentModal'
import { TableSkeleton, Alert, LoadingSpinner } from '../components'
import MatchPaymentModal from '../components/MatchPaymentModal'
import { apiClient } from '../lib/api'

// Define Payment interface inline - matches backend API response
interface Payment {
  id: string
  invoiceId?: string
  companyId: string
  amount: number // in Rappen (cents)
  valueDate: string | Date
  reference?: string
  description?: string
  confidence?: string
  isMatched?: boolean
  importBatch?: string
  rawData?: any
  notes?: string
  createdAt: string | Date
  updatedAt: string | Date
  invoice?: {
    id: string
    number: string
    customer?: {
      name: string
    }
  }
}

const Payments: React.FC = () => {
  const navigate = useNavigate()
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const { t } = useLanguage()
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; payment: any }>({
    isOpen: false,
    payment: null
  })
  const [importModal, setImportModal] = useState(false)
  const [paymentModal, setPaymentModal] = useState(false)
  const [matchModal, setMatchModal] = useState<{ isOpen: boolean; payment: Payment | null }>({ isOpen: false, payment: null })

  React.useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      try {
        const response = await apiClient.getPayments()
        console.log('[Payments] API response:', response)
        
        if (response?.success && response?.data) {
          // Handle paginated response
          const paymentList = response.data.payments || response.data || []
          setPayments(paymentList)
          setError(null)
        } else if (Array.isArray(response)) {
          // Handle direct array response
          setPayments(response)
          setError(null)
        } else {
          setPayments([])
          setError(null)
        }
      } catch (err: any) {
        console.error('[Payments] Error fetching payments:', err)
        setError(err?.response?.data?.error || t.payment.failedToLoad)
        setPayments([])
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const handleDeletePayment = async (payment: any) => {
    try {
      // Here you would call the API to delete the payment
      // await apiClient.deletePayment(payment.id)
      console.log('Deleting payment:', payment.id)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove from local state
      setPayments(prev => prev.filter(p => p.id !== payment.id))
      showSuccess(t.payment.paymentDeleted, t.payment.paymentDeletedSuccess || `Payment of ${payment.amount} ${payment.currency} has been deleted successfully.`)
    } catch (error) {
      showError(t.common.error, t.common.error)
    }
  }

  const handleCreatePayment = () => {
    setPaymentModal(true)
  }

  const handleImportPayments = () => {
    setImportModal(true)
  }

  const handlePaymentCreated = (paymentData: any) => {
    console.log('Payment created:', paymentData)
    // Add to local state
    setPayments(prev => [...prev, { ...paymentData, id: Date.now().toString() }])
    showSuccess(t.payment.paymentAdded, t.payment.paymentAddedSuccess || 'Payment has been added successfully.')
  }

  const handlePaymentsImported = async (importData: any) => {
    console.log('Payments imported:', importData)
    showSuccess(t.payment.paymentsImported, `${t.payment.successfullyImported || 'Successfully imported'} ${importData?.data?.payments?.length || 0} ${t.payment.import.toLowerCase()}.`)
    
    // Refresh payments list
    try {
      const response = await apiClient.getPayments()
      if (response?.success && response?.data) {
        const paymentList = response.data.payments || response.data || []
        setPayments(paymentList)
      } else if (Array.isArray(response)) {
        setPayments(response)
      }
    } catch (err) {
      console.error('Error refreshing payments:', err)
    }
  }

  const handleEditPayment = (payment: any) => {
    showInfo(t.payment.editPayment, t.payment.editComingSoon?.replace('{{id}}', payment.id) || `Edit functionality for payment ${payment.id} will be implemented soon.`)
  }

  const openMatchPayment = (payment: Payment) => {
    setMatchModal({ isOpen: true, payment })
  }

  const handleMatched = async () => {
    // After matching, refresh list
    try {
      const response = await apiClient.getPayments()
      if (response?.success && response?.data) {
        const paymentList = response.data.payments || response.data || []
        setPayments(paymentList)
      } else if (Array.isArray(response)) {
        setPayments(response)
      }
      showSuccess(t.payment.paymentMatched, t.payment.paymentLinkedSuccess || 'Payment linked to invoice successfully.')
    } catch (e) {
      console.error('Error refreshing payments after match:', e)
    }
  }

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
          title={t.payment.failedToLoad}
          message={error}
          onClose={() => window.location.reload()}
        >
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t.payment.tryAgain}
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
              {t.payment.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {t.payment.subtitle}
            </p>
          </div>
          <div className="flex space-x-2">
            <TouchButton
              variant="outline"
              size="md"
              onClick={handleImportPayments}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              {t.payment.import}
            </TouchButton>
            <TouchButton
              variant="primary"
              size="md"
              onClick={handleCreatePayment}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t.payment.newPayment}
            </TouchButton>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={[
          {
            key: 'confidence',
            label: t.payment.matchStatus || 'Match Status',
            type: 'select',
            options: [
              { value: 'HIGH', label: t.payment.highConfidence || 'High Confidence' },
              { value: 'MEDIUM', label: t.payment.mediumConfidence || 'Medium Confidence' },
              { value: 'LOW', label: t.payment.lowConfidence || 'Low Confidence' },
              { value: 'MANUAL', label: t.payment.manual || 'Manual' },
            ]
          },
          {
            key: 'isMatched',
            label: t.payment.matched || 'Matched',
            type: 'select',
            options: [
              { value: 'true', label: t.payment.matched || 'Matched' },
              { value: 'false', label: t.payment.unmatched || 'Unmatched' },
            ]
          },
          {
            key: 'amount',
            label: t.payment.amount,
            type: 'number',
            placeholder: t.payment.filterByAmount || 'Filter by amount (CHF)'
          },
          {
            key: 'valueDate',
            label: t.payment.paymentDate || 'Payment Date',
            type: 'dateRange'
          },
          {
            key: 'reference',
            label: t.payment.reference,
            type: 'text',
            placeholder: t.payment.searchByReference || 'Search by reference'
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t.payment.noPaymentsYet || 'No payments yet'}</h3>
            <p className="text-gray-600 mb-4">{t.payment.startByImporting || 'Start by importing payments or adding them manually'}</p>
            <div className="flex space-x-2 justify-center">
              <TouchButton
                variant="outline"
                onClick={handleImportPayments}
              >
                {t.payment.importPayments || 'Import Payments'}
              </TouchButton>
              <TouchButton
                variant="primary"
                onClick={handleCreatePayment}
              >
                {t.payment.addPayment || 'Add Payment'}
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
                label: t.payment.amount || 'Payment',
                sortable: true,
                priority: 'high',
                render: (value, row: Payment) => (
                  <div>
                    <span className="font-medium text-gray-900">CHF {((value || 0) / 100).toFixed(2)}</span>
                    <div className="text-sm text-gray-500">{row.description || row.confidence || 'Payment'}</div>
                  </div>
                ),
                mobileRender: (row: Payment) => (
                  <div>
                    <span className="font-medium text-gray-900">CHF {((row.amount || 0) / 100).toFixed(2)}</span>
                    <div className="text-sm text-gray-500">
                      {row.isMatched ? (t.payment.matched || 'Matched') : (t.payment.unmatched || 'Unmatched')}
                      {row.confidence && ` • ${row.confidence}`}
                    </div>
                  </div>
                )
              },
              {
                key: 'invoice',
                label: t.payment.invoice,
                sortable: true,
                priority: 'high',
                render: (value, row) => (
                  <div>
                    {row.invoice ? (
                      <>
                        <span className="font-medium text-gray-900">{row.invoice.number}</span>
                        <div className="text-sm text-gray-500">{row.invoice.customer?.name || 'N/A'}</div>
                      </>
                    ) : (
                      <span className="text-gray-500">{t.payment.unmatched || 'Unmatched'}</span>
                    )}
                  </div>
                )
              },
              {
                key: 'valueDate',
                label: t.payment.date,
                sortable: true,
                priority: 'medium',
                render: (value) => (
                  <span className="text-gray-600">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
                )
              },
              {
                key: 'reference',
                label: t.payment.reference,
                sortable: true,
                priority: 'low',
                render: (value) => (
                  <span className="text-gray-600 text-sm">{value || 'N/A'}</span>
                )
              },
              {
                key: 'actions' as any,
                label: t.payment.actions,
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
                      {t.payment.view}
                    </TouchButton>
                    <TouchButton
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openMatchPayment(row as any)
                      }}
                    >
                      {t.payment.match}
                    </TouchButton>
                    <TouchButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteModal({ isOpen: true, payment: row })
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {t.common.delete}
                    </TouchButton>
                  </div>
                )
              }
            ]}
            title={t.payment.paymentList || 'Payment List'}
            searchable={true}
            searchPlaceholder={t.payment.searchPayments || 'Search payments...'}
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
                render: (value, row: Payment) => (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">CHF {((value || 0) / 100).toFixed(2)}</span>
                    {row.isMatched && <span className="ml-2 text-green-600 text-xs">{t.payment.matched || 'Matched'}</span>}
                  </div>
                )
              },
              {
                key: 'invoice',
                label: t.payment.invoice,
                sortable: true,
                render: (value, row) => (
                  <div>
                    {row.invoice ? (
                      <>
                        <span className="font-medium text-gray-900">{row.invoice.number}</span>
                        <div className="text-sm text-gray-500">{row.invoice.customer?.name || 'N/A'}</div>
                      </>
                    ) : (
                      <span className="text-gray-500">{t.payment.unmatched || 'Unmatched'}</span>
                    )}
                  </div>
                )
              },
              {
                key: 'confidence',
                label: t.payment.status,
                sortable: true,
                render: (value, row: Payment) => (
                  <span className="text-gray-600">
                    {row.isMatched ? (t.payment.matched || 'Matched') : (t.payment.unmatched || 'Unmatched')}
                    {value && ` (${value})`}
                  </span>
                )
              },
              {
                key: 'valueDate',
                label: t.payment.date,
                sortable: true,
                render: (value) => (
                  <span className="text-gray-600">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
                )
              },
              {
                key: 'reference',
                label: t.payment.reference,
                sortable: true,
                render: (value) => (
                  <span className="text-gray-600">{value || 'N/A'}</span>
                )
              },
              {
                key: 'actions' as any,
                label: t.payment.actions,
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
                      {t.payment.view}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openMatchPayment(row as any)
                      }}
                    >
                      {t.payment.match}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteModal({ isOpen: true, payment: row })
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {t.common.delete}
                    </Button>
                  </div>
                )
              }
            ]}
            title={t.payment.paymentList || 'Payment List'}
            searchable={true}
            searchPlaceholder={t.payment.searchPayments || 'Search payments...'}
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

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, payment: null })}
        onConfirm={() => {
          handleDeletePayment(deleteModal.payment)
          setDeleteModal({ isOpen: false, payment: null })
        }}
        title={t.payment.deletePayment || 'Delete Payment'}
        message={t.payment.deleteConfirmation || `Are you sure you want to delete this payment? This action cannot be undone.`}
        confirmText={t.common.delete}
        cancelText={t.common.cancel}
        type="danger"
      />

      <PaymentImportModal
        isOpen={importModal}
        onClose={() => setImportModal(false)}
        onImport={handlePaymentsImported}
      />

      <PaymentModal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
        onSave={handlePaymentCreated}
      />

      <MatchPaymentModal
        isOpen={matchModal.isOpen}
        onClose={() => setMatchModal({ isOpen: false, payment: null })}
        payment={matchModal.payment}
        onMatched={handleMatched}
      />
    </div>
  )
}

export default Payments





