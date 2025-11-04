import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useCustomers } from '../hooks/useCustomers'
import Button from '../components/Button'
import TouchButton from '../components/TouchButton'
import DataTable from '../components/DataTable'
import CompactMobileTable from '../components/CompactMobileTable'
import AdvancedFilters from '../components/AdvancedFilters'
import ConfirmationModal from '../components/ConfirmationModal'
import { TableSkeleton, Alert, LoadingSpinner } from '../components'

const Customers: React.FC = () => {
  const navigate = useNavigate()
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const { t } = useLanguage()
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; customer: any }>({
    isOpen: false,
    customer: null
  })

  const { customers, loading, error, totalPages, totalCount, refetch } = useCustomers({
    page: currentPage,
    limit: pageSize,
    ...filters,
  })

  const handleDeleteCustomer = async (customer: any) => {
    try {
      // Here you would call the API to delete the customer
      // await apiClient.deleteCustomer(customer.id)
      console.log('Deleting customer:', customer.id)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      refetch()
      showSuccess(t.customer.customerDeleted, `${customer.name} ${t.common.success.toLowerCase()}.`)
    } catch (error) {
      showError(t.common.error, t.common.error)
    }
  }

  const handleCreateCustomer = () => {
    navigate('/customers/create')
  }


  const handleEditCustomer = (customer: any) => {
    showInfo(t.customer.edit, t.customer.editComingSoon?.replace('{{name}}', customer.name) || `Edit functionality for ${customer.name} will be implemented soon.`)
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
        <TableSkeleton rows={5} columns={5} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8 h-full overflow-y-auto">
          <Alert
            type="error"
            title={t.customer.failedToLoad}
            message={error}
            onClose={() => refetch()}
          >
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t.customer.tryAgain}
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
              {t.customer.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {t.customer.subtitle}
            </p>
          </div>
          <TouchButton
            variant="primary"
            size="md"
            fullWidth
            className="sm:w-auto"
            onClick={handleCreateCustomer}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t.customer.newCustomer}
          </TouchButton>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={[
          {
            key: 'isActive',
            label: t.invoice.status || 'Status',
            type: 'select',
            options: [
              { value: 'true', label: t.customer.active || 'Active' },
              { value: 'false', label: t.customer.inactive || 'Inactive' },
            ]
          },
          {
            key: 'country',
            label: t.customer.country,
            type: 'text',
            placeholder: t.customer.filterByCountry || 'Filter by country'
          },
          {
            key: 'paymentTerms',
            label: t.customer.paymentTerms,
            type: 'number',
            placeholder: t.customer.filterByPaymentTerms || 'Filter by payment terms (days)'
          },
          {
            key: 'search',
            label: t.common.search,
            type: 'text',
            placeholder: t.customer.searchPlaceholder || 'Search by name, company, or email'
          }
        ]}
        onApplyFilters={setFilters}
        onClearFilters={() => setFilters({})}
      />

      {/* Empty State */}
      {customers.length === 0 && !loading && !error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t.customer.noCustomersYet || 'No customers yet'}</h3>
            <p className="text-gray-600 mb-4">{t.customer.getStartedAdding || 'Get started by adding your first customer'}</p>
            <TouchButton
              variant="primary"
              onClick={handleCreateCustomer}
            >
              {t.customer.addCustomer || t.customer.newCustomer}
            </TouchButton>
          </div>
        </div>
      )}

      {/* Compact Mobile Table */}
      {customers.length > 0 && (
        <div className="block lg:hidden">
          <CompactMobileTable
            data={customers}
            columns={[
              {
                key: 'name',
                label: t.customer.title,
                sortable: true,
                priority: 'high',
                render: (value, row) => (
                  <div>
                    <span className="font-medium text-gray-900">{value}</span>
                    {row.company && (
                      <div className="text-sm text-gray-500">{row.company}</div>
                    )}
                  </div>
                ),
                mobileRender: (row) => (
                  <div>
                    <span className="font-medium text-gray-900">{row.name}</span>
                    {row.company && (
                      <div className="text-sm text-gray-500">{row.company}</div>
                    )}
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      row.isActive ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.isActive ? (t.customer.active || 'Active') : (t.customer.inactive || 'Inactive')}
                    </span>
                  </div>
                )
              },
              {
                key: 'email',
                label: t.customer.email,
                sortable: true,
                priority: 'medium',
                render: (value) => (
                  <span className="text-gray-600">{value || 'N/A'}</span>
                )
              },
              {
                key: 'city',
                label: t.customer.location || 'Location',
                sortable: true,
                priority: 'medium',
                render: (value, row) => (
                  <span className="text-gray-600">{value}, {row.country}</span>
                )
              },
              {
                key: 'paymentTerms',
                label: t.customer.paymentTerms,
                sortable: true,
                priority: 'low',
                render: (value) => (
                  <span className="text-gray-600">{value} {t.customer.days || 'days'}</span>
                )
              },
              {
                key: 'actions' as any,
                label: t.customer.actions,
                render: (_, row) => (
                  <div className="flex items-center space-x-2">
                    <TouchButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/customers/${row.id}`)
                      }}
                    >
                      {t.customer.view}
                    </TouchButton>
                    <TouchButton
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditCustomer(row)
                      }}
                    >
                      {t.customer.edit}
                    </TouchButton>
                    <TouchButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteModal({ isOpen: true, customer: row })
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {t.common.delete}
                    </TouchButton>
                  </div>
                )
              }
            ]}
            title={t.customer.customerList || 'Customer List'}
            searchable={true}
            searchPlaceholder={t.customer.searchCustomers || 'Search customers...'}
            pagination={true}
            pageSize={8}
            bulkActions={true}
            onBulkAction={(action, selectedRows) => {
              console.log('Bulk action:', action, selectedRows)
            }}
            onRowClick={(row) => navigate(`/customers/${row.id}`)}
          />
        </div>
      )}

      {/* Desktop Table */}
      {customers.length > 0 && (
        <div className="hidden lg:block">
          <DataTable
            data={customers}
            columns={[
              {
                key: 'name',
                label: t.customer.title,
                sortable: true,
                render: (value, row) => (
                  <div>
                    <span className="font-medium text-gray-900">{value}</span>
                    {row.company && (
                      <div className="text-sm text-gray-500">{row.company}</div>
                    )}
                  </div>
                )
              },
              {
                key: 'email',
                label: t.customer.email,
                sortable: true,
                render: (value) => (
                  <span className="text-gray-600">{value || 'N/A'}</span>
                )
              },
              {
                key: 'city',
                label: t.customer.location || 'Location',
                sortable: true,
                render: (value, row) => (
                  <span className="text-gray-600">{value}, {row.country}</span>
                )
              },
              {
                key: 'paymentTerms',
                label: t.customer.paymentTerms,
                sortable: true,
                render: (value) => (
                  <span className="text-gray-600">{value} {t.customer.days || 'days'}</span>
                )
              },
              {
                key: 'isActive',
                label: t.customer.status || 'Status',
                sortable: true,
                render: (value) => (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    value ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {value ? (t.customer.active || 'Active') : (t.customer.inactive || 'Inactive')}
                  </span>
                )
              },
              {
                key: 'actions' as any,
                label: t.customer.actions,
                render: (_, row) => (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/customers/${row.id}`)
                      }}
                    >
                      {t.customer.view}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditCustomer(row)
                      }}
                    >
                      {t.customer.edit}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteModal({ isOpen: true, customer: row })
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {t.common.delete}
                    </Button>
                  </div>
                )
              }
            ]}
            title={t.customer.customerList || 'Customer List'}
            searchable={true}
            searchPlaceholder={t.customer.searchCustomers || 'Search customers...'}
            pagination={true}
            pageSize={10}
            bulkActions={true}
            onBulkAction={(action, selectedRows) => {
              console.log('Bulk action:', action, selectedRows)
            }}
            onRowClick={(row) => navigate(`/customers/${row.id}`)}
          />
        </div>
      )}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, customer: null })}
        onConfirm={() => {
          handleDeleteCustomer(deleteModal.customer)
          setDeleteModal({ isOpen: false, customer: null })
        }}
        title={t.customer.delete}
        message={t.customer.deleteConfirmation?.replace('{{name}}', deleteModal.customer?.name || '') || `Are you sure you want to delete ${deleteModal.customer?.name}? This action cannot be undone.`}
        confirmText={t.common.delete}
        cancelText={t.common.cancel}
        type="danger"
      />

    </div>
  )
}

export default Customers






