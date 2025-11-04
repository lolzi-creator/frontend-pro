import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
import Button from '../components/Button'
import TouchButton from '../components/TouchButton'
import DataTable from '../components/DataTable'
import CompactMobileTable from '../components/CompactMobileTable'
import AdvancedFilters from '../components/AdvancedFilters'
import InvoiceModal from '../components/InvoiceModal'
import ConfirmationModal from '../components/ConfirmationModal'
import { TableSkeleton, Alert, LoadingSpinner } from '../components'
import { useInvoices } from '../hooks/useInvoices'
import { apiClient } from '../lib/api'

const Invoices: React.FC = () => {
  const navigate = useNavigate()
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const { t } = useLanguage()
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; invoice: any }>({
    isOpen: false,
    invoice: null
  })

  const { invoices, loading, error, totalCount, refetch } = useInvoices({
    page: currentPage,
    limit: pageSize,
    ...filters,
  })

  const handleInvoiceCreated = (invoiceData: any) => {
    console.log('Invoice created:', invoiceData)
    refetch()
    showSuccess(t.invoice.invoiceCreated, `${t.invoice.invoiceNumber} #${invoiceData.invoiceNumber || 'New'} ${t.common.success.toLowerCase()}.`)
  }

  const handleDeleteInvoice = async (invoice: any) => {
    if (!invoice?.id) {
      showError(t.common.error, 'Invalid invoice data')
      return
    }

    try {
      const response = await apiClient.deleteInvoice(invoice.id)
      if (response.success) {
        refetch()
        showSuccess(t.invoice.invoiceDeleted, `${t.invoice.invoiceNumber} #${invoice.number} ${t.common.success.toLowerCase()}.`)
      } else {
        showError(t.common.error, response.error || t.common.error)
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      showError(t.common.error, t.common.error)
    }
  }

  const handleStatusChange = async (invoice: any, newStatus: string) => {
    try {
      // Here you would call the API to update the invoice status
      // await apiClient.updateInvoiceStatus(invoice.id, newStatus)
      console.log('Updating invoice status:', invoice.id, newStatus)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      refetch()
      showSuccess('Status Updated', `Invoice #${invoice.number} status updated to ${newStatus}.`)
    } catch (error) {
      showError('Update Failed', 'Failed to update invoice status. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-success-100 text-success-800'
      case 'SENT':
        return 'bg-accent-100 text-accent-800'
      case 'OVERDUE':
        return 'bg-error-100 text-error-800'
      case 'DRAFT':
        return 'bg-neutral-100 text-neutral-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
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
      case 'OVERDUE':
        return (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'DRAFT':
        return (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'CANCELLED':
        return (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
            title={t.invoice.failedToLoad}
            message={error}
            onClose={() => refetch()}
          >
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t.invoice.tryAgain}
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
              {t.invoice.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {t.invoice.subtitle}
            </p>
          </div>
          <TouchButton
            variant="primary"
            size="md"
            fullWidth
            className="sm:w-auto"
            onClick={() => navigate('/invoices/create')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t.invoice.newInvoice}
          </TouchButton>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={[
          {
            key: 'status',
            label: t.invoice.status,
            type: 'select',
            options: [
              { value: 'DRAFT', label: t.invoice.draft },
              { value: 'SENT', label: t.invoice.sent },
              { value: 'PAID', label: t.invoice.paidStatus },
              { value: 'OVERDUE', label: t.invoice.overdue },
              { value: 'CANCELLED', label: t.invoice.cancelled },
            ]
          },
          {
            key: 'amount',
              label: t.invoice.amount,
            type: 'number',
            placeholder: t.invoice.filterByAmount
          },
          {
            key: 'dueDate',
              label: t.invoice.dueDate,
            type: 'dateRange'
          },
          {
            key: 'customer',
            label: t.invoice.customer,
            type: 'text',
            placeholder: t.invoice.searchByCustomer
          }
        ]}
        onApplyFilters={setFilters}
        onClearFilters={() => setFilters({})}
      />

      {/* Compact Mobile Table */}
      <div className="block lg:hidden">
        <CompactMobileTable
          data={invoices}
          columns={[
            {
              key: 'number',
              label: `${t.invoice.invoiceNumber} #`,
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
              label: t.invoice.customer,
              sortable: true,
              priority: 'high',
              render: (value, row) => (
                <span className="text-gray-900">{row.customer?.name || 'N/A'}</span>
              )
            },
            {
              key: 'total',
              label: t.invoice.amount,
              sortable: true,
              priority: 'high',
              render: (value, row) => (
                <span className="font-medium text-gray-900">{row.currency} {value?.toFixed(2) || '0.00'}</span>
              )
            },
            {
              key: 'status',
              label: t.invoice.status,
              sortable: true,
              priority: 'medium',
              render: (value) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}>
                  {getStatusIcon(value)}
                  <span className="ml-1 capitalize">{value?.toLowerCase() || 'unknown'}</span>
                </span>
              )
            },
            {
              key: 'dueDate',
              label: t.invoice.dueDate,
              sortable: true,
              priority: 'medium',
              render: (value) => (
                <span className="text-gray-600">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
              )
            },
            {
              key: 'actions' as any,
              label: t.invoice.actions,
              render: (_, row) => (
                <div className="flex items-center space-x-2">
                  <TouchButton
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/invoices/${row.id}`)
                    }}
                  >
                    {t.invoice.view}
                  </TouchButton>
                  <TouchButton
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/invoices/${row.id}/edit`)
                    }}
                  >
                    {t.invoice.edit}
                  </TouchButton>
                  <TouchButton
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteModal({ isOpen: true, invoice: row })
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {t.common.delete}
                  </TouchButton>
                </div>
              )
            }
          ]}
          title="Invoice List"
          searchable={true}
          searchPlaceholder="Search invoices..."
          pagination={true}
          pageSize={8}
          bulkActions={true}
          onBulkAction={(action, selectedRows) => {
            console.log('Bulk action:', action, selectedRows)
          }}
          onRowClick={(row) => navigate(`/invoices/${row.id}`)}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <DataTable
          data={invoices}
          columns={[
            {
              key: 'number',
              label: `${t.invoice.invoiceNumber} #`,
              sortable: true,
              render: (value) => (
                <span className="font-medium text-gray-900">{value}</span>
              )
            },
            {
              key: 'customer',
              label: t.invoice.customer,
              sortable: true,
              render: (value, row) => (
                <span className="text-gray-900">{row.customer?.name || 'N/A'}</span>
              )
            },
            {
              key: 'total',
              label: t.invoice.amount,
              sortable: true,
              render: (value, row) => (
                <span className="font-medium text-gray-900">{row.currency} {value?.toFixed(2) || '0.00'}</span>
              )
            },
            {
              key: 'status',
              label: t.invoice.status,
              sortable: true,
              render: (value) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}>
                  {getStatusIcon(value)}
                  <span className="ml-1 capitalize">{value?.toLowerCase() || 'unknown'}</span>
                </span>
              )
            },
            {
              key: 'dueDate',
              label: t.invoice.dueDate,
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
                      navigate(`/invoices/${row.id}`)
                    }}
                  >
                    {t.invoice.view}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/invoices/${row.id}/edit`)
                    }}
                  >
                    {t.invoice.edit}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteModal({ isOpen: true, invoice: row })
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {t.common.delete}
                  </Button>
                </div>
              )
            }
          ]}
          title="Invoice List"
          searchable={true}
          searchPlaceholder="Search invoices..."
          pagination={true}
          pageSize={10}
          bulkActions={true}
          onBulkAction={(action, selectedRows) => {
            console.log('Bulk action:', action, selectedRows)
          }}
          onRowClick={(row) => navigate(`/invoices/${row.id}`)}
        />
      </div>

      {/* Invoice Creation Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleInvoiceCreated}
      />

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, invoice: null })}
        onConfirm={() => {
          handleDeleteInvoice(deleteModal.invoice)
          setDeleteModal({ isOpen: false, invoice: null })
        }}
        title={t.invoice.delete}
        message={t.invoice.deleteConfirmation.replace('{{number}}', deleteModal.invoice?.number || '')}
        confirmText={t.common.delete}
        cancelText={t.common.cancel}
        type="danger"
      />
    </div>
  )
}

export default Invoices
