import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import Card from '../components/Card'
import Button from '../components/Button'

interface Customer {
  id: string
  name: string
  customerNumber: string
  paymentTerms: number
  company?: string
}

interface QuoteItem {
  description: string
  quantity: number
  unit: string
  unitPrice: number
  discount: number
  vatRate: number
}

interface NewQuote {
  customerId: string
  date: string
  expiryDate: string
  discountCode: string
  discountAmount: number
  internalNotes: string
  items: QuoteItem[]
}

const CreateQuote: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showToast } = useToast()
  
  const isEditMode = !!id
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [originalQuote, setOriginalQuote] = useState<NewQuote | null>(null)
  
  const [newQuote, setNewQuote] = useState<NewQuote>({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    expiryDate: '',
    discountCode: '',
    discountAmount: 0,
    internalNotes: '',
    items: [{
      description: '',
      quantity: 1,
      unit: 'Stück',
      unitPrice: 0,
      discount: 0,
      vatRate: 7.7
    }]
  })

  const vatRates = [
    { value: 7.7, label: '7.7% (Standard)' },
    { value: 2.5, label: '2.5% (Reduziert)' },
    { value: 3.7, label: '3.7% (Beherbergung)' },
    { value: 0, label: '0% (Befreit)' }
  ]

  const units = ['Stück', 'Stunden', 'Tage', 'kg', 'Liter', 'Meter', 'Pauschal']

  useEffect(() => {
    loadCustomers()
    if (isEditMode && id) {
      loadQuote(id)
    }
  }, [id, isEditMode])

  const loadCustomers = async () => {
    try {
      const response = await apiClient.getCustomers()
      if (response.success) {
        setCustomers(response.data.customers || [])
      }
    } catch (error) {
      console.error('Error loading customers:', error)
      showToast({ type: 'error', title: 'Failed to load customers' })
    }
  }

  const loadQuote = async (quoteId: string) => {
    try {
      setLoading(true)
      const response = await apiClient.getQuote(quoteId)
      if (response.success && response.data.quote) {
        const quote = response.data.quote
        
        // Check if quote is editable (only DRAFT status)
        if (quote.status !== 'DRAFT') {
          showToast({ 
            type: 'error', 
            title: 'Cannot Edit Quote',
            message: 'Only draft quotes can be edited.'
          })
          navigate('/quotes')
          return
        }

        // Populate form with existing quote data
        const quoteData = {
          customerId: quote.customerId,
          date: quote.date instanceof Date ? quote.date.toISOString().split('T')[0] : quote.date.split('T')[0],
          expiryDate: quote.expiryDate instanceof Date ? quote.expiryDate.toISOString().split('T')[0] : quote.expiryDate.split('T')[0],
          discountCode: quote.discountCode || '',
          discountAmount: quote.discountAmount || 0,
          internalNotes: quote.internalNotes || '',
          items: quote.items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            discount: item.discount,
            vatRate: item.vatRate
          }))
        }
        
        setNewQuote(quoteData)
        setOriginalQuote(quoteData)
      }
    } catch (error) {
      console.error('Error loading quote:', error)
      showToast({ type: 'error', title: 'Failed to load quote' })
      navigate('/quotes')
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    let expiryDate = ''
    
    if (customer) {
      const quoteDate = new Date(newQuote.date)
      quoteDate.setDate(quoteDate.getDate() + 30) // Default 30 days validity
      expiryDate = quoteDate.toISOString().split('T')[0]
    }
    
    setNewQuote({
      ...newQuote,
      customerId,
      expiryDate
    })
  }

  const handleDateChange = (date: string) => {
    let expiryDate = newQuote.expiryDate
    
    if (newQuote.customerId) {
      const quoteDate = new Date(date)
      quoteDate.setDate(quoteDate.getDate() + 30)
      expiryDate = quoteDate.toISOString().split('T')[0]
    }
    
    setNewQuote({
      ...newQuote,
      date,
      expiryDate
    })
  }

  const addQuoteItem = () => {
    setNewQuote({
      ...newQuote,
      items: [...newQuote.items, {
        description: '',
        quantity: 1,
        unit: 'Stück',
        unitPrice: 0,
        discount: 0,
        vatRate: 7.7
      }]
    })
  }

  const removeQuoteItem = (index: number) => {
    if (newQuote.items.length > 1) {
      const newItems = newQuote.items.filter((_, i) => i !== index)
      setNewQuote({ ...newQuote, items: newItems })
    }
  }

  const updateQuoteItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...newQuote.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setNewQuote({ ...newQuote, items: newItems })
  }

  const calculateItemTotal = (item: QuoteItem) => {
    const subtotal = item.quantity * item.unitPrice
    const discounted = subtotal * (1 - item.discount / 100)
    const withVat = discounted * (1 + item.vatRate / 100)
    return withVat
  }

  const calculateTotals = () => {
    const subtotal = newQuote.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice
      const discounted = itemSubtotal * (1 - item.discount / 100)
      return sum + discounted
    }, 0)

    const vatAmount = newQuote.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice
      const discounted = itemSubtotal * (1 - item.discount / 100)
      const vat = discounted * (item.vatRate / 100)
      return sum + vat
    }, 0)

    const total = subtotal + vatAmount - newQuote.discountAmount

    return { subtotal, vatAmount, total }
  }

  const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true
    if (obj1 == null || obj2 == null) return false
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) return false

    for (let key of keys1) {
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        if (obj1[key].length !== obj2[key].length) return false
        for (let i = 0; i < obj1[key].length; i++) {
          if (!deepEqual(obj1[key][i], obj2[key][i])) return false
        }
      } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        if (!deepEqual(obj1[key], obj2[key])) return false
      } else if (obj1[key] !== obj2[key]) {
        return false
      }
    }

    return true
  }

  const hasChanges = (): boolean => {
    if (!isEditMode || !originalQuote) return true
    
    return !deepEqual(newQuote, originalQuote)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newQuote.customerId) {
      showToast({ type: 'error', title: 'Please select a customer' })
      return
    }

    if (newQuote.items.some(item => !item.description.trim())) {
      showToast({ type: 'error', title: 'Please fill in all item descriptions' })
      return
    }

    if (newQuote.items.some(item => item.unitPrice <= 0)) {
      showToast({ type: 'error', title: 'Please enter valid unit prices' })
      return
    }

    // Check if anything has changed in edit mode
    if (isEditMode && !hasChanges()) {
      showToast({ 
        type: 'info', 
        title: 'No changes made',
        message: 'No changes were made to the quote.'
      })
      return
    }

    try {
      setSubmitting(true)
      
      const quoteData = {
        customerId: newQuote.customerId,
        date: newQuote.date,
        expiryDate: newQuote.expiryDate,
        discountCode: newQuote.discountCode || undefined,
        discountAmount: newQuote.discountAmount || 0,
        internalNotes: newQuote.internalNotes || undefined,
        items: newQuote.items.map(item => ({
          description: item.description.trim(),
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          vatRate: item.vatRate
        }))
      }

      let response
      if (isEditMode && id) {
        response = await apiClient.updateQuote(id, quoteData)
      } else {
        response = await apiClient.createQuote(quoteData)
      }
      
      if (response.success) {
        showToast({ 
          type: 'success', 
          title: isEditMode ? 'Quote updated successfully!' : 'Quote created successfully!',
          message: `Quote number: ${response.data.quote.number}`
        })
        
        navigate(`/quotes/${response.data.quote.id}`)
      } else {
        showToast({ type: 'error', title: isEditMode ? 'Failed to update quote' : 'Failed to create quote' })
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} quote:`, error)
      showToast({ type: 'error', title: isEditMode ? 'Failed to update quote' : 'Failed to create quote' })
    } finally {
      setSubmitting(false)
    }
  }

  const { subtotal, vatAmount, total } = calculateTotals()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Edit Quote' : 'Create New Quote'}</h1>
          <p className="mt-2 text-gray-600">{isEditMode ? 'Update the quote details below' : 'Fill in the details below to create a new quote'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Quote Info */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quote Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer *
                  </label>
                  <select
                    value={newQuote.customerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.customerNumber}) - {customer.paymentTerms} days
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quote Date *
                  </label>
                  <input
                    type="date"
                    value={newQuote.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={newQuote.expiryDate}
                    onChange={(e) => setNewQuote({...newQuote, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Quote is valid until this date
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Discount */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Discount</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Code
                  </label>
                  <input
                    type="text"
                    value={newQuote.discountCode}
                    onChange={(e) => setNewQuote({...newQuote, discountCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SUMMER2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Amount (CHF)
                  </label>
                  <input
                    type="number"
                    value={newQuote.discountAmount}
                    onChange={(e) => setNewQuote({...newQuote, discountAmount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Internal Notes */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Internal Notes</h2>
            </div>
            <div className="p-6">
              <textarea
                value={newQuote.internalNotes}
                onChange={(e) => setNewQuote({...newQuote, internalNotes: e.target.value})}
                placeholder="Add any internal notes about this quote..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[100px]"
                rows={4}
              />
            </div>
          </Card>

          {/* Quote Items */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Quote Items</h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addQuoteItem}
                  className="text-sm"
                >
                  ➕ Add Item
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {newQuote.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-sm text-gray-700">
                        Item {index + 1}
                      </span>
                      {newQuote.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuoteItem(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          ❌ Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Description *
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateQuoteItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                          placeholder="Service or product description"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuoteItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                          min="0.001"
                          step="0.001"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Unit
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) => updateQuoteItem(index, 'unit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                        >
                          {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Unit Price (CHF) *
                        </label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateQuoteItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => updateQuoteItem(index, 'discount', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                          step="0.1"
                          min="0"
                          max="100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          VAT Rate (%)
                        </label>
                        <select
                          value={item.vatRate}
                          onChange={(e) => updateQuoteItem(index, 'vatRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                        >
                          {vatRates.map(rate => (
                            <option key={rate.value} value={rate.value}>{rate.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Item Total Preview */}
                    <div className="mt-3 text-right">
                      <span className="text-sm text-gray-600">
                        Item Total: CHF {calculateItemTotal(item).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Totals Summary */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quote Summary</h2>
            </div>
            <div className="p-6">
              <div className="max-w-md ml-auto">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>CHF {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT:</span>
                    <span>CHF {vatAmount.toFixed(2)}</span>
                  </div>
                  {newQuote.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span>-CHF {newQuote.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>CHF {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/quotes')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? (isEditMode ? 'Updating Quote...' : 'Creating Quote...') : (isEditMode ? 'Update Quote' : 'Create Quote')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateQuote



