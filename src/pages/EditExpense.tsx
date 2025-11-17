import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
import Card from '../components/Card'
import Button from '../components/Button'
import FileUpload from '../components/FileUpload'

interface ExpenseFormData {
  title: string
  description: string
  category: string
  subcategory: string
  amount: number
  currency: string
  vatRate: number
  expenseDate: string
  paymentDate: string
  paymentMethod: string
  vendorName: string
  isTaxDeductible: boolean
  isRecurring: boolean
  recurringPeriod: string
  budgetCategory: string
  notes: string
}

const EditExpense: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [vatRates, setVatRates] = useState<Array<{ value: number; label: string }>>([
    { value: 8.1, label: t.expense.vatStandard || '8.1% (Standard)' },
    { value: 2.6, label: t.expense.vatReduced || '2.6% (Reduced)' },
    { value: 3.8, label: t.expense.vatAccommodation || '3.8% (Accommodation)' },
    { value: 0, label: t.expense.vatExempt || '0% (Exempt)' }
  ])
  
  const [expense, setExpense] = useState<ExpenseFormData>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    amount: 0,
    currency: 'CHF',
    vatRate: 8.1,
    expenseDate: new Date().toISOString().split('T')[0],
    paymentDate: '',
    paymentMethod: '',
    vendorName: '',
    isTaxDeductible: true,
    isRecurring: false,
    recurringPeriod: '',
    budgetCategory: '',
    notes: ''
  })

  const paymentMethods = [
    { value: 'CASH', label: t.expense.cash || 'Cash' },
    { value: 'CREDIT_CARD', label: t.expense.creditCard || 'Credit Card' },
    { value: 'DEBIT_CARD', label: t.expense.debitCard || 'Debit Card' },
    { value: 'BANK_TRANSFER', label: t.expense.bankTransfer || 'Bank Transfer' },
    { value: 'CHECK', label: t.expense.check || 'Check' },
    { value: 'OTHER', label: t.expense.other || 'Other' }
  ]

  const recurringPeriods = [
    { value: 'monthly', label: t.expense.monthly || 'Monthly' },
    { value: 'quarterly', label: t.expense.quarterly || 'Quarterly' },
    { value: 'yearly', label: t.expense.yearly || 'Yearly' }
  ]

  useEffect(() => {
    loadVatRates()
    if (id) {
      loadCategories()
      loadExpense()
    }
  }, [id])

  const loadVatRates = async () => {
    try {
      const response = await apiClient.getVatRates()
      if (response.success && response.data?.vatRates && response.data.vatRates.length > 0) {
        const formattedRates = response.data.vatRates.map((rate: any) => ({
          value: rate.rate,
          label: `${rate.rate}% (${rate.name})`
        }))
        setVatRates(formattedRates)
      }
    } catch (error) {
      console.error('Error loading VAT rates:', error)
      // Use default rates if API fails
    }
  }

  const loadCategories = async () => {
    try {
      const response = await apiClient.getExpenseCategories()
      if (response.success) {
        setCategories(response.data.categories || [])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadExpense = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      const response = await apiClient.getExpense(id)
      
      if (response?.success && response?.data) {
        const expenseData = response.data.expense || response.data
        
        // Convert amounts from Rappen to CHF for display
        // Normalize field names from snake_case to camelCase
        setExpense({
          title: expenseData.title || '',
          description: expenseData.description || '',
          category: expenseData.category || '',
          subcategory: expenseData.subcategory || '',
          amount: (expenseData.amount || 0) / 100, // Convert from Rappen
          currency: expenseData.currency || 'CHF',
          vatRate: expenseData.vat_rate || expenseData.vatRate || 8.1,
          expenseDate: expenseData.expense_date || expenseData.expenseDate || new Date().toISOString().split('T')[0],
          paymentDate: expenseData.payment_date || expenseData.paymentDate || '',
          paymentMethod: expenseData.payment_method || expenseData.paymentMethod || '',
          vendorName: expenseData.vendor_name || expenseData.vendorName || '',
          isTaxDeductible: expenseData.is_tax_deductible !== undefined ? expenseData.is_tax_deductible : expenseData.isTaxDeductible !== undefined ? expenseData.isTaxDeductible : true,
          isRecurring: expenseData.is_recurring !== undefined ? expenseData.is_recurring : expenseData.isRecurring !== undefined ? expenseData.isRecurring : false,
          recurringPeriod: expenseData.recurring_period || expenseData.recurringPeriod || '',
          budgetCategory: expenseData.budget_category || expenseData.budgetCategory || '',
          notes: expenseData.notes || ''
        })
      } else {
        showToast({ type: 'error', title: t.expense.failedToLoadExpense || 'Failed to load expense' })
        navigate('/expenses')
      }
    } catch (error) {
      console.error('Error loading expense:', error)
      showToast({ type: 'error', title: 'Failed to load expense' })
      navigate('/expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof ExpenseFormData, value: string | number | boolean) => {
    setExpense({
      ...expense,
      [field]: value
    })
  }

  const calculateVATAmount = () => {
    if (!expense.amount || !expense.vatRate) return 0
    return (expense.amount * expense.vatRate) / 100
  }

  const calculateTotal = () => {
    return expense.amount + calculateVATAmount()
  }

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id) return
    
    // Validation
    if (!expense.title.trim()) {
      showToast({ type: 'error', title: t.expense.titleRequired || 'Title is required' })
      return
    }

    if (!expense.category) {
      showToast({ type: 'error', title: t.expense.categoryRequired || 'Category is required' })
      return
    }

    if (!expense.amount || expense.amount <= 0) {
      showToast({ type: 'error', title: t.expense.validAmountRequired || 'Please enter a valid amount' })
      return
    }

    if (!expense.expenseDate) {
      showToast({ type: 'error', title: t.expense.expenseDateRequired || 'Expense date is required' })
      return
    }

    try {
      setSubmitting(true)
      
      // Prepare expense data - convert CHF to Rappen (cents)
      // Backend expects snake_case field names
      const expenseData: any = {
        title: expense.title.trim(),
        category: expense.category,
        amount: Math.round(expense.amount * 100), // Convert to Rappen
        expense_date: expense.expenseDate,
        currency: expense.currency,
        vat_rate: expense.vatRate,
        is_tax_deductible: expense.isTaxDeductible,
      }
      
      // Add optional fields
      if (expense.description.trim()) {
        expenseData.description = expense.description.trim()
      } else {
        expenseData.description = null
      }
      if (expense.subcategory.trim()) {
        expenseData.subcategory = expense.subcategory.trim()
      } else {
        expenseData.subcategory = null
      }
      if (expense.paymentDate) {
        expenseData.payment_date = expense.paymentDate
      } else {
        expenseData.payment_date = null
      }
      if (expense.paymentMethod) {
        expenseData.payment_method = expense.paymentMethod
      } else {
        expenseData.payment_method = null
      }
      if (expense.vendorName.trim()) {
        expenseData.vendor_name = expense.vendorName.trim()
      } else {
        expenseData.vendor_name = null
      }
      if (expense.isRecurring) {
        expenseData.is_recurring = true
        if (expense.recurringPeriod) {
          expenseData.recurring_period = expense.recurringPeriod
        } else {
          expenseData.recurring_period = null
        }
      } else {
        expenseData.is_recurring = false
        expenseData.recurring_period = null
      }
      if (expense.budgetCategory.trim()) {
        expenseData.budget_category = expense.budgetCategory.trim()
      } else {
        expenseData.budget_category = null
      }
      if (expense.notes.trim()) {
        expenseData.notes = expense.notes.trim()
      } else {
        expenseData.notes = null
      }

      // Update expense
      const response = await apiClient.updateExpense(id, expenseData)
      
      if (response.success) {
        // Upload new files if any
        if (selectedFiles.length > 0) {
          try {
            setUploadingFiles(true)
            await apiClient.uploadExpenseFiles(id, selectedFiles)
          } catch (fileError) {
            console.error('Error uploading files:', fileError)
            showToast({ 
              type: 'warning', 
              title: t.expense.expenseUpdatedFilesFailed || 'Expense updated but files failed to upload',
              message: t.expense.addFilesLater || 'You can add files later from the expense detail page'
            })
          } finally {
            setUploadingFiles(false)
          }
        }
        
        showToast({ 
          type: 'success', 
          title: t.expense.expenseUpdatedSuccess || 'Expense updated successfully!'
        })
        
        // Navigate back to expense detail
        navigate(`/expenses/${id}`)
      } else {
        showToast({ type: 'error', title: t.expense.failedToUpdateExpense || 'Failed to update expense', message: response.error })
      }
    } catch (error: any) {
      console.error('Error updating expense:', error)
        showToast({ 
          type: 'error', 
          title: t.expense.failedToUpdateExpense || 'Failed to update expense',
          message: error.response?.data?.error || 'An unexpected error occurred'
        })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">{t.expense.loadingExpenseData || 'Loading expense...'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.expense.edit}</h1>
          <p className="mt-2 text-gray-600">{t.expense.updateExpenseDetails || 'Update the expense details below'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t.expense.basicInfo || 'Basic Information'}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.title} *
                  </label>
                  <input
                    type="text"
                    value={expense.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.expense.titlePlaceholder || 'e.g., Office Supplies Purchase'}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.description}
                  </label>
                  <textarea
                    value={expense.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder={t.expense.descriptionPlaceholder || 'Additional details about this expense...'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.category} *
                  </label>
                  <select
                    value={expense.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t.expense.selectCategory || 'Select Category'}</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.subcategory || 'Subcategory'}
                  </label>
                  <input
                    type="text"
                    value={expense.subcategory}
                    onChange={(e) => handleChange('subcategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.expense.optional || 'Optional'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.vendorSupplier || 'Vendor/Supplier'}
                  </label>
                  <input
                    type="text"
                    value={expense.vendorName}
                    onChange={(e) => handleChange('vendorName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.expense.vendorPlaceholder || 'Company or person name'}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Financial Information */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t.expense.financialInfo || 'Financial Information'}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.amountCHF || 'Amount (CHF)'} *
                  </label>
                  <input
                    type="number"
                    value={expense.amount || ''}
                    onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                    onFocus={(e) => {
                      if (parseFloat(e.target.value) === 0) {
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.vatRate || 'VAT Rate'} (%)
                  </label>
                  <select
                    value={expense.vatRate}
                    onChange={(e) => handleChange('vatRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {vatRates.map(rate => (
                      <option key={rate.value} value={rate.value}>{rate.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.currency}
                  </label>
                  <select
                    value={expense.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="CHF">CHF</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{t.expense.subtotal || 'Subtotal:'}</span>
                    <span className="ml-2 font-medium">{expense.currency} {expense.amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t.expense.vatRate || 'VAT'} ({expense.vatRate}%):</span>
                    <span className="ml-2 font-medium">{expense.currency} {calculateVATAmount().toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">{t.expense.total}:</span>
                    <span className="ml-2 font-bold text-lg">{expense.currency} {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={expense.isTaxDeductible}
                    onChange={(e) => handleChange('isTaxDeductible', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{t.expense.taxDeductible || 'Tax deductible'}</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Payment Details */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t.expense.paymentDetails || 'Payment Details'}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.expenseDate || 'Expense Date'} *
                  </label>
                  <input
                    type="date"
                    value={expense.expenseDate}
                    onChange={(e) => handleChange('expenseDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.paymentDate || 'Payment Date'}
                  </label>
                  <input
                    type="date"
                    value={expense.paymentDate}
                    onChange={(e) => handleChange('paymentDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.paymentMethod || 'Payment Method'}
                  </label>
                  <select
                    value={expense.paymentMethod}
                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t.expense.selectCategory || 'Select Method'}</option>
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Options */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t.expense.additionalOptions || 'Additional Options'}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={expense.isRecurring}
                    onChange={(e) => handleChange('isRecurring', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{t.expense.recurringExpenseLabel || 'This is a recurring expense'}</span>
                </div>
                
                {expense.isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.expense.recurringPeriod || 'Recurring Period'}
                    </label>
                    <select
                      value={expense.recurringPeriod}
                      onChange={(e) => handleChange('recurringPeriod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{t.expense.selectPeriod || 'Select Period'}</option>
                      {recurringPeriods.map(period => (
                        <option key={period.value} value={period.value}>{period.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.budgetCategory || 'Budget Category'} ({t.expense.optional || 'Optional'})
                  </label>
                  <input
                    type="text"
                    value={expense.budgetCategory}
                    onChange={(e) => handleChange('budgetCategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.expense.budgetCategoryPlaceholder || 'For budget tracking'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.notes || 'Notes'}
                  </label>
                  <textarea
                    value={expense.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder={t.expense.notesPlaceholder || 'Additional notes about this expense...'}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* File Upload */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t.expense.addMoreReceipts || 'Add More Receipts & Documents'}</h2>
            </div>
            <div className="p-6">
              <FileUpload
                onFilesSelected={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                multiple
                maxFiles={10}
              />
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {t.expense.filesSelected?.replace('{{count}}', selectedFiles.length.toString()) || `${selectedFiles.length} new file(s) selected`}
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/expenses/${id}`)}
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || uploadingFiles}
            >
              {submitting || uploadingFiles 
                ? (uploadingFiles ? (t.expense.uploadingFiles || 'Uploading Files...') : (t.expense.updatingExpense || 'Updating Expense...')) 
                : t.expense.edit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditExpense

