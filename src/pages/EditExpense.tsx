import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
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
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  
  const [expense, setExpense] = useState<ExpenseFormData>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    amount: 0,
    currency: 'CHF',
    vatRate: 7.7,
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

  const vatRates = [
    { value: 7.7, label: '7.7% (Standard)' },
    { value: 2.5, label: '2.5% (Reduziert)' },
    { value: 3.7, label: '3.7% (Beherbergung)' },
    { value: 0, label: '0% (Befreit)' }
  ]

  const paymentMethods = [
    { value: 'CASH', label: 'Cash' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'DEBIT_CARD', label: 'Debit Card' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CHECK', label: 'Check' },
    { value: 'OTHER', label: 'Other' }
  ]

  const recurringPeriods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ]

  useEffect(() => {
    if (id) {
      loadCategories()
      loadExpense()
    }
  }, [id])

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
          vatRate: expenseData.vat_rate || expenseData.vatRate || 7.7,
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
        showToast({ type: 'error', title: 'Failed to load expense' })
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
      showToast({ type: 'error', title: 'Title is required' })
      return
    }

    if (!expense.category) {
      showToast({ type: 'error', title: 'Category is required' })
      return
    }

    if (!expense.amount || expense.amount <= 0) {
      showToast({ type: 'error', title: 'Please enter a valid amount' })
      return
    }

    if (!expense.expenseDate) {
      showToast({ type: 'error', title: 'Expense date is required' })
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
              title: 'Expense updated but files failed to upload',
              message: 'You can add files later from the expense detail page'
            })
          } finally {
            setUploadingFiles(false)
          }
        }
        
        showToast({ 
          type: 'success', 
          title: 'Expense updated successfully!'
        })
        
        // Navigate back to expense detail
        navigate(`/expenses/${id}`)
      } else {
        showToast({ type: 'error', title: 'Failed to update expense', message: response.error })
      }
    } catch (error: any) {
      console.error('Error updating expense:', error)
      showToast({ 
        type: 'error', 
        title: 'Failed to update expense',
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
              <p className="text-gray-600 mt-4">Loading expense...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Expense</h1>
          <p className="mt-2 text-gray-600">Update the expense details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={expense.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Office Supplies Purchase"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={expense.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Additional details about this expense..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={expense.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={expense.subcategory}
                    onChange={(e) => handleChange('subcategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor/Supplier
                  </label>
                  <input
                    type="text"
                    value={expense.vendorName}
                    onChange={(e) => handleChange('vendorName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company or person name"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Financial Information */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Financial Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (CHF) *
                  </label>
                  <input
                    type="number"
                    value={expense.amount || ''}
                    onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT Rate (%)
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
                    Currency
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
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="ml-2 font-medium">{expense.currency} {expense.amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">VAT ({expense.vatRate}%):</span>
                    <span className="ml-2 font-medium">{expense.currency} {calculateVATAmount().toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">Total:</span>
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
                  <span className="ml-2 text-sm text-gray-700">Tax deductible</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Payment Details */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Payment Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expense Date *
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
                    Payment Date
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
                    Payment Method
                  </label>
                  <select
                    value={expense.paymentMethod}
                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Method</option>
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
              <h2 className="text-lg font-medium text-gray-900">Additional Options</h2>
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
                  <span className="ml-2 text-sm text-gray-700">This is a recurring expense</span>
                </div>
                
                {expense.isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recurring Period
                    </label>
                    <select
                      value={expense.recurringPeriod}
                      onChange={(e) => handleChange('recurringPeriod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Period</option>
                      {recurringPeriods.map(period => (
                        <option key={period.value} value={period.value}>{period.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Category (Optional)
                  </label>
                  <input
                    type="text"
                    value={expense.budgetCategory}
                    onChange={(e) => handleChange('budgetCategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="For budget tracking"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={expense.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Additional notes about this expense..."
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* File Upload */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Add More Receipts & Documents</h2>
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
                    {selectedFiles.length} new file(s) selected
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
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || uploadingFiles}
            >
              {submitting || uploadingFiles 
                ? (uploadingFiles ? 'Uploading Files...' : 'Updating Expense...') 
                : 'Update Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditExpense

