import React, { useState, useEffect } from 'react'
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
import { TableSkeleton, Alert, LoadingSpinner, Card } from '../components'
import Modal from '../components/Modal'

interface Expense {
  id: string
  title: string
  description?: string
  category: string
  subcategory?: string
  amount: number
  currency: string
  vatRate: number
  vatAmount: number
  expenseDate: string
  paymentDate?: string
  paymentMethod?: string
  vendorName?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID'
  isTaxDeductible: boolean
  attachments?: any[]
}

const Expenses: React.FC = () => {
  const navigate = useNavigate()
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const { t } = useLanguage()
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; expense: any }>({
    isOpen: false,
    expense: null
  })
  
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [stats, setStats] = useState<any>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [exportDateRange, setExportDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchExpenses()
    fetchStats()
  }, [currentPage, filters])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {
        page: currentPage,
        limit: pageSize,
        ...filters
      }
      
      const response = await apiClient.getExpenses(params)
      
      if (response.success) {
        // Convert amounts from Rappen to CHF for display and normalize field names
        const expensesData = (response.data.expenses || []).map((exp: any) => ({
          ...exp,
          amount: exp.amount / 100,
          vatAmount: (exp.vat_amount || 0) / 100,
          expenseDate: exp.expense_date || exp.expenseDate,
          paymentDate: exp.payment_date || exp.paymentDate,
          paymentMethod: exp.payment_method || exp.paymentMethod,
          vendorName: exp.vendor_name || exp.vendorName,
          vatRate: exp.vat_rate || exp.vatRate,
          isTaxDeductible: exp.is_tax_deductible !== undefined ? exp.is_tax_deductible : exp.isTaxDeductible,
          isRecurring: exp.is_recurring !== undefined ? exp.is_recurring : exp.isRecurring,
          recurringPeriod: exp.recurring_period || exp.recurringPeriod,
          budgetCategory: exp.budget_category || exp.budgetCategory
        }))
        
        setExpenses(expensesData)
        setTotalCount(response.data.pagination?.total || 0)
        setTotalPages(response.data.pagination?.pages || 0)
      } else {
        setError(response.error || 'Failed to load expenses')
      }
    } catch (err) {
      console.error('Error fetching expenses:', err)
      setError(t.expense.failedToLoad)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await apiClient.getExpenseStats('month')
      if (response.success) {
        setStats(response.data)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleDeleteExpense = async (expense: any) => {
    if (!expense?.id) {
      showError(t.common.error, 'Invalid expense data')
      return
    }

    try {
      const response = await apiClient.deleteExpense(expense.id)
      if (response.success) {
        fetchExpenses()
        fetchStats()
        showSuccess(t.expense.expenseDeleted, t.expense.expenseDeletedSuccess || `${expense.title} ${t.common.success.toLowerCase()}.`)
      } else {
        showError(t.common.error, response.error || t.common.error)
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      showError(t.common.error, t.common.error)
    }
  }

  const handleCreateExpense = () => {
    navigate('/expenses/create')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const formatCurrency = (amount: number, currency: string = 'CHF') => {
    return `${currency} ${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return date.toLocaleDateString('de-CH')
    } catch (e) {
      return 'Invalid Date'
    }
  }

  if (loading && expenses.length === 0) {
    return (
      <div className="p-4 lg:p-8 h-full overflow-y-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <TableSkeleton rows={5} columns={6} />
      </div>
    )
  }

  if (error && expenses.length === 0) {
    return (
      <div className="p-4 lg:p-8 h-full overflow-y-auto">
        <Alert
          type="error"
          title={t.expense.failedToLoad}
          message={error}
          onClose={() => fetchExpenses()}
        >
          <button
            onClick={() => fetchExpenses()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t.expense.tryAgain}
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
              {t.expense.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {t.expense.subtitle}
            </p>
          </div>
          <div className="flex gap-3">
            <TouchButton
              variant="outline"
              size="md"
              onClick={() => setShowExportModal(true)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t.expense.export}
            </TouchButton>
            <TouchButton
              variant="primary"
              size="md"
              fullWidth
              className="sm:w-auto"
              onClick={handleCreateExpense}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t.expense.newExpense}
            </TouchButton>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">{t.expense.totalThisMonth || 'Total This Month'}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency((stats.totalAmount || 0) / 100)}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">{t.expense.numberOfExpenses || 'Number of Expenses'}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCount || 0}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">{t.expense.pending}</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.statusStats?.PENDING?.count || 0}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">{t.expense.approved}</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.statusStats?.APPROVED?.count || 0}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={[
          {
            key: 'category',
            label: t.expense.category,
            type: 'text',
            placeholder: t.expense.filterByCategory || 'Filter by category'
          },
          {
            key: 'status',
            label: t.expense.status,
            type: 'select',
            options: [
              { value: 'PENDING', label: t.expense.pending },
              { value: 'APPROVED', label: t.expense.approved },
              { value: 'REJECTED', label: t.expense.rejected },
              { value: 'PAID', label: t.expense.paid },
            ]
          },
          {
            key: 'startDate',
            label: t.expense.startDate || 'Start Date',
            type: 'date'
          },
          {
            key: 'endDate',
            label: t.expense.endDate || 'End Date',
            type: 'date'
          },
          {
            key: 'search',
            label: t.common.search || 'Search',
            type: 'text',
            placeholder: t.expense.searchByTitle || 'Search by title or description'
          }
        ]}
        onApplyFilters={setFilters}
        onClearFilters={() => setFilters({})}
      />

      {/* Empty State */}
      {expenses.length === 0 && !loading && !error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t.expense.noExpensesYet || 'No expenses yet'}</h3>
            <p className="text-gray-600 mb-4">{t.expense.getStartedAdding || 'Get started by adding your first expense'}</p>
            <TouchButton
              variant="primary"
              onClick={handleCreateExpense}
            >
              {t.expense.newExpense}
            </TouchButton>
          </div>
        </div>
      )}

      {/* Compact Mobile Table */}
      {expenses.length > 0 && (
        <div className="block lg:hidden">
          <CompactMobileTable
            data={expenses}
            columns={[
              {
                key: 'title',
                label: t.expense.titleLabel || 'Expense',
                sortable: true,
                priority: 'high',
                render: (value, row) => (
                  <div>
                    <span className="font-medium text-gray-900">{value}</span>
                    <div className="text-sm text-gray-500">{row.category}</div>
                  </div>
                )
              },
              {
                key: 'amount',
                label: t.expense.amount,
                sortable: true,
                priority: 'high',
                render: (value, row) => (
                  <span className="font-medium text-gray-900">
                    {formatCurrency(value, row.currency)}
                  </span>
                )
              },
              {
                key: 'expenseDate',
                label: t.expense.date,
                sortable: true,
                priority: 'medium',
                render: (value) => <span className="text-gray-600">{formatDate(value)}</span>
              },
              {
                key: 'status',
                label: t.expense.status,
                sortable: true,
                priority: 'medium',
                render: (value) => (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}>
                    {value}
                  </span>
                )
              },
              {
                key: 'actions' as any,
                label: t.expense.actions,
                render: (_, row) => (
                  <div className="flex items-center space-x-2">
                    <TouchButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/expenses/${row.id}`)
                      }}
                    >
                      {t.expense.view}
                    </TouchButton>
                    <TouchButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteModal({ isOpen: true, expense: row })
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {t.common.delete}
                    </TouchButton>
                  </div>
                )
              }
            ]}
            title={t.expense.expenseList || 'Expense List'}
            searchable={true}
            searchPlaceholder={t.expense.searchExpenses || 'Search expenses...'}
            pagination={true}
            pageSize={8}
            onRowClick={(row) => navigate(`/expenses/${row.id}`)}
          />
        </div>
      )}

      {/* Desktop Table */}
      {expenses.length > 0 && (
        <div className="hidden lg:block">
          <DataTable
            data={expenses}
            columns={[
              {
                key: 'title',
                label: t.expense.titleLabel || 'Expense',
                sortable: true,
                render: (value, row) => (
                  <div>
                    <span className="font-medium text-gray-900">{value}</span>
                    {row.category && (
                      <div className="text-sm text-gray-500">{row.category}</div>
                    )}
                  </div>
                )
              },
              {
                key: 'category',
                label: t.expense.category,
                sortable: true,
                render: (value) => <span className="text-gray-600">{value}</span>
              },
              {
                key: 'amount',
                label: t.expense.amount,
                sortable: true,
                render: (value, row) => (
                  <span className="font-medium text-gray-900">
                    {formatCurrency(value, row.currency)}
                  </span>
                )
              },
              {
                key: 'expenseDate',
                label: t.expense.date,
                sortable: true,
                render: (value) => <span className="text-gray-600">{formatDate(value)}</span>
              },
              {
                key: 'status',
                label: t.expense.status,
                sortable: true,
                render: (value) => (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}>
                    {value}
                  </span>
                )
              },
              {
                key: 'actions' as any,
                label: t.expense.actions,
                render: (_, row) => (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/expenses/${row.id}`)
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteModal({ isOpen: true, expense: row })
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                )
              }
            ]}
            title={t.expense.expenseList || 'Expense List'}
            searchable={true}
            searchPlaceholder={t.expense.searchExpenses || 'Search expenses...'}
            pagination={true}
            pageSize={10}
            onRowClick={(row) => navigate(`/expenses/${row.id}`)}
          />
        </div>
      )}

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={t.expense.exportExpenses || 'Export Expenses'}
        size="md"
      >
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                {t.expense.exportExpenses || 'Export expenses as a ZIP file containing PDF summary report, Excel spreadsheet, and all receipt files.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.expense.startDate || 'Start Date'} *
                </label>
                <input
                  type="date"
                  value={exportDateRange.start}
                  onChange={(e) => setExportDateRange({ ...exportDateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.expense.endDate || 'End Date'} *
                </label>
                <input
                  type="date"
                  value={exportDateRange.end}
                  onChange={(e) => setExportDateRange({ ...exportDateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>{t.expense.exportIncludes || 'Export includes:'}</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
                <li>{t.expense.exportIncludesPdf || 'PDF summary report with totals and category breakdown'}</li>
                <li>{t.expense.exportIncludesExcel || 'Excel spreadsheet with all expense details'}</li>
                <li>{t.expense.exportIncludesReceipts || 'All receipt files organized by category'}</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowExportModal(false)}
                disabled={exportLoading}
              >
                {t.common.cancel}
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  if (!exportDateRange.start || !exportDateRange.end) {
                    showError(t.expense.exportFailed || 'Export Failed', t.expense.selectDates || 'Please select start and end dates')
                    return
                  }

                  try {
                    setExportLoading(true)
                    const blob = await apiClient.exportExpenses(exportDateRange.start, exportDateRange.end)
                    
                    // Create download link
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `expenses-export-${exportDateRange.start}-to-${exportDateRange.end}.zip`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    window.URL.revokeObjectURL(url)

                    showSuccess(t.expense.exportSuccessful || 'Export Successful', t.expense.exportSuccessful || 'Expenses exported successfully!')
                    setShowExportModal(false)
                  } catch (error: any) {
                    console.error('Export error:', error)
                    showError(t.expense.exportFailed || 'Export Failed', error.response?.data?.error || t.expense.exportFailed || 'Failed to export expenses. Please try again.')
                  } finally {
                    setExportLoading(false)
                  }
                }}
                disabled={exportLoading || !exportDateRange.start || !exportDateRange.end}
              >
                {exportLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                    {t.expense.exporting || 'Exporting...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t.expense.exportZIP || 'Export ZIP'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, expense: null })}
        onConfirm={() => {
          handleDeleteExpense(deleteModal.expense)
          setDeleteModal({ isOpen: false, expense: null })
        }}
        title={t.expense.deleteExpense || 'Delete Expense'}
        message={t.expense.deleteConfirmation?.replace('{{title}}', deleteModal.expense?.title || '') || `Are you sure you want to delete "${deleteModal.expense?.title}"? This action cannot be undone and all associated files will be deleted.`}
        confirmText={t.common.delete}
        cancelText={t.common.cancel}
        type="danger"
      />
    </div>
  )
}

export default Expenses

