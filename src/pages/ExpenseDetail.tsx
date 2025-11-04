import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
import ConfirmationModal from '../components/ConfirmationModal'

const ExpenseDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const [expense, setExpense] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showPaymentDateModal, setShowPaymentDateModal] = useState(false)
  const [paymentDate, setPaymentDate] = useState('')

  useEffect(() => {
    const fetchExpense = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const response = await apiClient.getExpense(id)
        
        if (response?.success && response?.data) {
          const expenseData = response.data.expense || response.data
          // Convert amounts from Rappen to CHF for display
          setExpense({
            ...expenseData,
            amount: (expenseData.amount || 0) / 100,
            vatAmount: (expenseData.vat_amount || 0) / 100
          })
        } else {
          showToast({ type: 'error', title: t.expense.failedToLoadExpense || 'Failed to load expense' })
          navigate('/expenses')
        }
      } catch (error) {
        console.error('Error fetching expense:', error)
        showToast({ type: 'error', title: 'Failed to load expense' })
        navigate('/expenses')
      } finally {
        setLoading(false)
      }
    }

    fetchExpense()
  }, [id, navigate, showToast])

  const fetchExpenseData = async () => {
    if (!id) return
    
    try {
      const response = await apiClient.getExpense(id)
      
      if (response?.success && response?.data) {
        const expenseData = response.data.expense || response.data
        // Convert amounts from Rappen to CHF for display
        setExpense({
          ...expenseData,
          amount: (expenseData.amount || 0) / 100,
          vatAmount: (expenseData.vat_amount || 0) / 100
        })
      }
    } catch (error) {
      console.error('Error fetching expense:', error)
    }
  }

  const handleDelete = async () => {
    if (!expense?.id) return
    
    try {
      setDeleting(true)
      const response = await apiClient.deleteExpense(expense.id)
      
      if (response.success) {
        showToast({ type: 'success', title: t.expense.expenseDeletedSuccess || 'Expense deleted successfully' })
        navigate('/expenses')
      } else {
        showToast({ type: 'error', title: t.expense.failedToDeleteExpense || 'Failed to delete expense', message: response.error })
        setDeleteModal(false)
      }
    } catch (error: any) {
      console.error('Error deleting expense:', error)
      showToast({ 
        type: 'error', 
        title: 'Failed to delete expense',
        message: error.response?.data?.error || 'An unexpected error occurred'
      })
      setDeleteModal(false)
    } finally {
      setDeleting(false)
    }
  }

  const handleUpdateStatus = async (status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID') => {
    if (!expense?.id) return
    
    try {
      setActionLoading('status')
      const response = await apiClient.updateExpense(expense.id, { status })
      
      if (response.success) {
        showToast({ type: 'success', title: t.expense.expenseMarkedAs?.replace('{{status}}', status) || `Expense marked as ${status}` })
        await fetchExpenseData()
      } else {
        showToast({ type: 'error', title: t.expense.failedToUpdateStatus || 'Failed to update status', message: response.error })
      }
    } catch (error: any) {
      console.error('Error updating status:', error)
      showToast({ 
        type: 'error', 
        title: 'Failed to update status',
        message: error.response?.data?.error || 'An unexpected error occurred'
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddPaymentDate = async () => {
    if (!expense?.id || !paymentDate) return
    
    try {
      setActionLoading('payment-date')
      const response = await apiClient.updateExpense(expense.id, { payment_date: paymentDate })
      
      if (response.success) {
        showToast({ type: 'success', title: t.expense.paymentDateAddedSuccess || 'Payment date added successfully' })
        setShowPaymentDateModal(false)
        setPaymentDate('')
        await fetchExpenseData()
      } else {
        showToast({ type: 'error', title: t.expense.failedToAddPaymentDate || 'Failed to add payment date', message: response.error })
      }
    } catch (error: any) {
      console.error('Error adding payment date:', error)
      showToast({ 
        type: 'error', 
        title: 'Failed to add payment date',
        message: error.response?.data?.error || 'An unexpected error occurred'
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkAsPaid = async () => {
    if (!expense?.id) return
    
    try {
      setActionLoading('paid')
      const today = new Date().toISOString().split('T')[0]
      const response = await apiClient.updateExpense(expense.id, { 
        status: 'PAID',
        payment_date: today
      })
      
      if (response.success) {
        showToast({ type: 'success', title: t.expense.expenseMarkedAs?.replace('{{status}}', 'PAID') || 'Expense marked as paid' })
        await fetchExpenseData()
      } else {
        showToast({ type: 'error', title: t.expense.failedToMarkAsPaid || 'Failed to mark as paid', message: response.error })
      }
    } catch (error: any) {
      console.error('Error marking as paid:', error)
      showToast({ 
        type: 'error', 
        title: 'Failed to mark as paid',
        message: error.response?.data?.error || 'An unexpected error occurred'
      })
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('de-CH')
  }

  const formatCurrency = (amount: number, currency: string = 'CHF') => {
    return `${currency} ${amount.toFixed(2)}`
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

  const getPaymentMethodLabel = (method: string | undefined) => {
    if (!method) return 'N/A'
    const methods: Record<string, string> = {
      'CASH': t.expense.cash || 'Cash',
      'CREDIT_CARD': t.expense.creditCard || 'Credit Card',
      'DEBIT_CARD': t.expense.debitCard || 'Debit Card',
      'BANK_TRANSFER': t.expense.bankTransfer || 'Bank Transfer',
      'CHECK': t.expense.check || 'Check',
      'OTHER': t.expense.other || 'Other'
    }
    return methods[method] || method
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">{t.expense.loadingExpense || 'Loading expense...'}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!expense) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.expense.expenseNotFound || 'Expense not found'}</h2>
          <Button onClick={() => navigate('/expenses')}>{t.expense.backToExpenses || 'Back to Expenses'}</Button>
        </div>
      </div>
    )
  }

  const totalAmount = expense.amount + expense.vatAmount

  return (
    <div className="p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/expenses')}
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.expense.backToExpenses || 'Back to Expenses'}
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Poppins'}}>
                {expense.title || 'Expense Details'}
              </h2>
              <p className="text-gray-600">{t.expense.expenseDetails || 'Expense Details'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(expense.status)}`}>
              {expense.status || 'PENDING'}
            </span>
            <Button
              variant="outline"
              onClick={() => setDeleteModal(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t.expense.deleteExpense || 'Delete'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t.expense.basicInformation || 'Basic Information'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t.expense.title}</p>
                  <p className="font-medium text-gray-900">{expense.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t.expense.category}</p>
                  <p className="font-medium text-gray-900">{expense.category || 'N/A'}</p>
                </div>
                {expense.subcategory && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t.expense.subcategory || 'Subcategory'}</p>
                    <p className="font-medium text-gray-900">{expense.subcategory}</p>
                  </div>
                )}
                {expense.vendorName && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t.expense.vendorSupplier || 'Vendor/Supplier'}</p>
                    <p className="font-medium text-gray-900">{expense.vendorName}</p>
                  </div>
                )}
                {expense.description && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">{t.expense.description}</p>
                    <p className="font-medium text-gray-900 whitespace-pre-wrap">{expense.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t.expense.financialInformation || 'Financial Information'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t.expense.amount}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(expense.amount, expense.currency || 'CHF')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t.expense.vatRate || 'VAT Rate'}</p>
                    <p className="font-medium text-gray-900">{expense.vatRate || expense.vat_rate || 0}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t.expense.vatAmount || 'VAT Amount'}</p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(expense.vatAmount, expense.currency || 'CHF')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t.expense.total}</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(totalAmount, expense.currency || 'CHF')}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={expense.isTaxDeductible || expense.is_tax_deductible || false}
                      readOnly
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{t.expense.taxDeductible || 'Tax deductible'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment & Date Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t.expense.paymentDateInformation || 'Payment & Date Information'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t.expense.expenseDate || 'Expense Date'}</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(expense.expenseDate || expense.expense_date)}
                  </p>
                </div>
                {expense.paymentDate || expense.payment_date ? (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t.expense.paymentDate || 'Payment Date'}</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(expense.paymentDate || expense.payment_date)}
                    </p>
                  </div>
                ) : null}
                {expense.paymentMethod || expense.payment_method ? (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t.expense.paymentMethod || 'Payment Method'}</p>
                    <p className="font-medium text-gray-900">
                      {getPaymentMethodLabel(expense.paymentMethod || expense.payment_method)}
                    </p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          {(expense.isRecurring || expense.is_recurring || expense.budgetCategory || expense.budget_category || expense.notes) && (
            <Card>
              <CardHeader>
                <CardTitle>{t.expense.additionalInformation || 'Additional Information'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expense.isRecurring || expense.is_recurring ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t.expense.recurringExpense || 'Recurring Expense'}</p>
                      <p className="font-medium text-gray-900">
                        Yes {expense.recurringPeriod || expense.recurring_period ? `(${expense.recurringPeriod || expense.recurring_period})` : ''}
                      </p>
                    </div>
                  ) : null}
                  {expense.budgetCategory || expense.budget_category ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t.expense.budgetCategory || 'Budget Category'}</p>
                      <p className="font-medium text-gray-900">{expense.budgetCategory || expense.budget_category}</p>
                    </div>
                  ) : null}
                  {expense.notes ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t.expense.notes || 'Notes'}</p>
                      <p className="font-medium text-gray-900 whitespace-pre-wrap">{expense.notes}</p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {expense.attachments && expense.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t.expense.receiptsDocuments || 'Receipts & Documents'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expense.attachments.map((file: any) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.originalName || file.filename}</p>
                          <p className="text-xs text-gray-500">
                            {(file.fileSize || 0) > 0 ? `${(file.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
                          </p>
                        </div>
                      </div>
                      {file.url || file.downloadUrl ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(file.url || file.downloadUrl, '_blank')}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {t.expense.download || 'Download'}
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
                <CardTitle>{t.expense.summary || 'Summary'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t.expense.status}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(expense.status)}`}>
                    {expense.status || 'PENDING'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t.expense.totalAmount || 'Total Amount'}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalAmount, expense.currency || 'CHF')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t.expense.created || 'Created'}</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(expense.createdAt || expense.created_at)}
                  </p>
                </div>
                {expense.updatedAt || expense.updated_at ? (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t.expense.lastUpdated || 'Last Updated'}</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(expense.updatedAt || expense.updated_at)}
                    </p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t.expense.actions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Status Management */}
                {/* Only show "Mark as Paid" if expense is APPROVED */}
                {expense.status === 'APPROVED' && (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleMarkAsPaid}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === 'paid' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t.expense.markingAsPaid || 'Marking as Paid...'}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t.expense.markAsPaid}
                      </>
                    )}
                  </Button>
                )}
                
                {!expense.paymentDate && !expense.payment_date && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setPaymentDate(new Date().toISOString().split('T')[0])
                      setShowPaymentDateModal(true)
                    }}
                    disabled={actionLoading !== null}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t.expense.addPaymentDate || 'Add Payment Date'}
                  </Button>
                )}
                
                {(expense.paymentDate || expense.payment_date) && expense.status !== 'PAID' && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setPaymentDate(expense.paymentDate || expense.payment_date || new Date().toISOString().split('T')[0])
                      setShowPaymentDateModal(true)
                    }}
                    disabled={actionLoading !== null}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t.expense.updatePaymentDate || 'Update Payment Date'}
                  </Button>
                )}

                {/* Status Buttons */}
                {expense.status === 'PENDING' && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full text-green-700 hover:bg-green-50"
                      onClick={() => handleUpdateStatus('APPROVED')}
                      disabled={actionLoading !== null}
                    >
                      {actionLoading === 'status' ? (
                        t.expense.updating || 'Updating...'
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t.expense.approve}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-700 hover:bg-red-50"
                      onClick={() => handleUpdateStatus('REJECTED')}
                      disabled={actionLoading !== null}
                    >
                      {actionLoading === 'status' ? (
                        t.expense.updating || 'Updating...'
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {t.expense.reject}
                        </>
                      )}
                    </Button>
                  </>
                )}

                {expense.status === 'APPROVED' && expense.status !== 'PAID' && (
                  <Button
                    variant="outline"
                    className="w-full text-yellow-700 hover:bg-yellow-50"
                    onClick={() => handleUpdateStatus('PENDING')}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === 'status' ? (
                      t.expense.updating || 'Updating...'
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t.expense.markAsPending || 'Mark as Pending'}
                      </>
                    )}
                  </Button>
                )}

                {expense.status === 'REJECTED' && (
                  <Button
                    variant="outline"
                    className="w-full text-blue-700 hover:bg-blue-50"
                    onClick={() => handleUpdateStatus('PENDING')}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === 'status' ? (
                      t.expense.updating || 'Updating...'
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {t.expense.resetToPending || 'Reset to Pending'}
                      </>
                    )}
                  </Button>
                )}

                <div className="pt-3 border-t border-gray-200 mt-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/expenses/${id}/edit`)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {t.expense.edit}
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:bg-red-50"
                  onClick={() => setDeleteModal(true)}
                  disabled={actionLoading !== null || deleting}
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                      {t.expense.deleting || 'Deleting...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {t.expense.deleteExpense || 'Delete Expense'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Date Modal */}
      <Modal
        isOpen={showPaymentDateModal}
        onClose={() => {
          setShowPaymentDateModal(false)
          setPaymentDate('')
        }}
        title={t.expense.addPaymentDate || 'Add Payment Date'}
        size="sm"
      >
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.expense.paymentDate || 'Payment Date'} *
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowPaymentDateModal(false)
                setPaymentDate('')
              }}
              disabled={actionLoading !== null}
            >
              {t.common.cancel}
            </Button>
            <Button
              variant="primary"
              onClick={handleAddPaymentDate}
              disabled={actionLoading !== null || !paymentDate}
            >
              {actionLoading === 'payment-date' ? 'Saving...' : (t.expense.addPaymentDate || 'Save Payment Date')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title={t.expense.deleteExpense || 'Delete Expense'}
        message={t.expense.deleteConfirmation?.replace('{{title}}', expense.title) || `Are you sure you want to delete "${expense.title}"? This action cannot be undone and all associated files will be deleted.`}
        confirmText={deleting ? (t.expense.deleting || "Deleting...") : t.common.delete}
        cancelText={t.common.cancel}
        type="danger"
      />
    </div>
  )
}

export default ExpenseDetail

