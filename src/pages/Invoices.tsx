import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import TouchButton from '../components/TouchButton'
import DataTable from '../components/DataTable'
import CompactMobileTable from '../components/CompactMobileTable'
import AdvancedFilters from '../components/AdvancedFilters'
import InvoiceModal from '../components/InvoiceModal'
import { useInvoices } from '../hooks/useInvoices'

const Invoices: React.FC = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)

  const { invoices, loading, error, totalCount, refetch } = useInvoices({
    page: currentPage,
    limit: pageSize,
    ...filters,
  })

  const handleInvoiceCreated = (invoiceData: any) => {
    console.log('Invoice created:', invoiceData)
    // Refresh the invoices list
    refetch()
    // You could also show a success message here
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
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invoices...</p>
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
            <p className="text-red-600 mb-2">Error loading invoices</p>
            <p className="text-gray-600 text-sm">{error}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
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
              Invoices
            </h2>
            <p className="text-gray-600 text-sm">
              Manage your invoices and track payments
            </p>
          </div>
          <TouchButton
            variant="primary"
            size="md"
            fullWidth
            className="sm:w-auto"
            onClick={() => setIsInvoiceModalOpen(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Invoice
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
              { value: 'PAID', label: 'Paid' },
              { value: 'OVERDUE', label: 'Overdue' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]
          },
          {
            key: 'amount',
            label: 'Amount',
            type: 'number',
            placeholder: 'Filter by amount'
          },
          {
            key: 'dueDate',
            label: 'Due Date',
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

      {/* Compact Mobile Table */}
      <div className="block lg:hidden">
        <CompactMobileTable
          data={invoices}
          columns={[
            {
              key: 'number',
              label: 'Invoice #',
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
                  <span className="ml-1 capitalize">{value?.toLowerCase() || 'unknown'}</span>
                </span>
              )
            },
            {
              key: 'dueDate',
              label: 'Due Date',
              sortable: true,
              priority: 'medium',
              render: (value) => (
                <span className="text-gray-600">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
              )
            },
            {
              key: 'actions',
              label: 'Actions',
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
              label: 'Invoice #',
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
                  <span className="ml-1 capitalize">{value?.toLowerCase() || 'unknown'}</span>
                </span>
              )
            },
            {
              key: 'dueDate',
              label: 'Due Date',
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
    </div>
  )
}

export default Invoices
