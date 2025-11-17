import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
import Card from '../components/Card'
import Button from '../components/Button'
import FileUpload from '../components/FileUpload'

interface NewExpense {
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

const CreateExpense: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()
  
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
  
  const [newExpense, setNewExpense] = useState<NewExpense>({
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
    loadCategories()
    loadVatRates()
  }, [])

  const loadVatRates = async () => {
    try {
      const response = await apiClient.getVatRates()
      if (response.success && response.data?.vatRates && response.data.vatRates.length > 0) {
        const formattedRates = response.data.vatRates.map((rate: any) => ({
          value: rate.rate,
          label: `${rate.rate}% (${rate.name})`
        }))
        setVatRates(formattedRates)
        
        // Set default VAT rate
        const defaultRate = response.data.vatRates.find((r: any) => r.isDefault)
        if (defaultRate && newExpense.vatRate === 8.1) {
          setNewExpense({ ...newExpense, vatRate: defaultRate.rate })
        }
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

  const handleChange = (field: keyof NewExpense, value: string | number | boolean) => {
    setNewExpense({
      ...newExpense,
      [field]: value
    })
  }

  const calculateVATAmount = () => {
    if (!newExpense.amount || !newExpense.vatRate) return 0
    return (newExpense.amount * newExpense.vatRate) / 100
  }

  const calculateTotal = () => {
    return newExpense.amount + calculateVATAmount()
  }

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!newExpense.title.trim()) {
      showToast({ type: 'error', title: t.expense.titleRequired || 'Title is required' })
      return
    }

    if (!newExpense.category) {
      showToast({ type: 'error', title: t.expense.categoryRequired || 'Category is required' })
      return
    }

    if (!newExpense.amount || newExpense.amount <= 0) {
      showToast({ type: 'error', title: t.expense.validAmountRequired || 'Please enter a valid amount' })
      return
    }

    if (!newExpense.expenseDate) {
      showToast({ type: 'error', title: t.expense.expenseDateRequired || 'Expense date is required' })
      return
    }

    try {
      setSubmitting(true)
      
      // Prepare expense data - convert CHF to Rappen (cents)
      // Backend expects snake_case field names
      const expenseData: any = {
        title: newExpense.title.trim(),
        category: newExpense.category,
        amount: Math.round(newExpense.amount * 100), // Convert to Rappen
        expense_date: newExpense.expenseDate, // Backend expects snake_case
        currency: newExpense.currency,
        vat_rate: newExpense.vatRate,
        is_tax_deductible: newExpense.isTaxDeductible,
      }
      
      // Add optional fields only if they have values
      if (newExpense.description.trim()) {
        expenseData.description = newExpense.description.trim()
      }
      if (newExpense.subcategory.trim()) {
        expenseData.subcategory = newExpense.subcategory.trim()
      }
      if (newExpense.paymentDate) {
        expenseData.payment_date = newExpense.paymentDate
      }
      if (newExpense.paymentMethod) {
        expenseData.payment_method = newExpense.paymentMethod
      }
      if (newExpense.vendorName.trim()) {
        expenseData.vendor_name = newExpense.vendorName.trim()
      }
      if (newExpense.isRecurring) {
        expenseData.is_recurring = true
        if (newExpense.recurringPeriod) {
          expenseData.recurring_period = newExpense.recurringPeriod
        }
      }
      if (newExpense.budgetCategory.trim()) {
        expenseData.budget_category = newExpense.budgetCategory.trim()
      }
      if (newExpense.notes.trim()) {
        expenseData.notes = newExpense.notes.trim()
      }

      console.log('Submitting expense data:', expenseData)

      // Create expense first
      const response = await apiClient.createExpense(expenseData)
      
      if (response.success) {
        const expenseId = response.data.expense.id
        
        // Upload files if any
        if (selectedFiles.length > 0) {
          try {
            setUploadingFiles(true)
            await apiClient.uploadExpenseFiles(expenseId, selectedFiles)
          } catch (fileError) {
            console.error('Error uploading files:', fileError)
            showToast({ 
              type: 'warning', 
              title: t.expense.filesFailedUpload || 'Expense created but files failed to upload',
              message: t.expense.addFilesLater || 'You can add files later from the expense detail page'
            })
          } finally {
            setUploadingFiles(false)
          }
        }
        
        showToast({ 
          type: 'success', 
          title: t.expense.expenseCreatedSuccess || 'Expense created successfully!'
        })
        
        // Navigate back to expenses list
        navigate('/expenses')
      } else {
        showToast({ type: 'error', title: t.expense.failedToCreateExpense || 'Failed to create expense', message: response.error })
      }
    } catch (error: any) {
      console.error('Error creating expense:', error)
        showToast({ 
          type: 'error', 
          title: t.expense.failedToCreateExpense || 'Failed to create expense',
          message: error.response?.data?.error || 'An unexpected error occurred'
        })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.expense.createNewExpense || 'Create New Expense'}</h1>
          <p className="mt-2 text-gray-600">{t.expense.fillInDetails || 'Fill in the details below to create a new expense'}</p>
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
                    value={newExpense.title}
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
                    value={newExpense.description}
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
                    value={newExpense.category}
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
                    value={newExpense.subcategory}
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
                    value={newExpense.vendorName}
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
                    value={newExpense.amount || ''}
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
                    value={newExpense.vatRate}
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
                    value={newExpense.currency}
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
                    <span className="ml-2 font-medium">{newExpense.currency} {newExpense.amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t.expense.vatRate || 'VAT'} ({newExpense.vatRate}%):</span>
                    <span className="ml-2 font-medium">{newExpense.currency} {calculateVATAmount().toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">{t.expense.total}:</span>
                    <span className="ml-2 font-bold text-lg">{newExpense.currency} {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newExpense.isTaxDeductible}
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
                    value={newExpense.expenseDate}
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
                    value={newExpense.paymentDate}
                    onChange={(e) => handleChange('paymentDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expense.paymentMethod || 'Payment Method'}
                  </label>
                  <select
                    value={newExpense.paymentMethod}
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
                    checked={newExpense.isRecurring}
                    onChange={(e) => handleChange('isRecurring', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{t.expense.recurringExpenseLabel || 'This is a recurring expense'}</span>
                </div>
                
                {newExpense.isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.expense.recurringPeriod || 'Recurring Period'}
                    </label>
                    <select
                      value={newExpense.recurringPeriod}
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
                    value={newExpense.budgetCategory}
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
                    value={newExpense.notes}
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
              <h2 className="text-lg font-medium text-gray-900">{t.expense.receiptsDocuments || 'Receipts & Documents'}</h2>
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
                    {t.expense.filesSelected?.replace('{{count}}', selectedFiles.length.toString()) || `${selectedFiles.length} file(s) selected`}
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
              onClick={() => navigate('/expenses')}
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || uploadingFiles}
            >
              {submitting || uploadingFiles 
                ? (uploadingFiles ? (t.expense.uploadingFiles || 'Uploading Files...') : (t.expense.creatingExpense || 'Creating Expense...')) 
                : t.expense.create}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateExpense

