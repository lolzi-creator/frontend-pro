import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

interface InvoiceItem {
  description: string
  quantity: number
  unit: string
  unitPrice: number
  discount: number
  vatRate: number
}

interface NewInvoice {
  customerId: string
  date: string
  dueDate: string
  discountCode: string
  discountAmount: number
  items: InvoiceItem[]
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [newInvoice, setNewInvoice] = useState<NewInvoice>({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    discountCode: '',
    discountAmount: 0,
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
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getCustomers()
      if (response.success) {
        setCustomers(response.data.customers || [])
      }
    } catch (error) {
      console.error('Error loading customers:', error)
      showToast({ type: 'error', title: 'Failed to load customers' })
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    let dueDate = ''
    
    if (customer) {
      const invoiceDate = new Date(newInvoice.date)
      invoiceDate.setDate(invoiceDate.getDate() + customer.paymentTerms)
      dueDate = invoiceDate.toISOString().split('T')[0]
    }
    
    setNewInvoice({
      ...newInvoice,
      customerId,
      dueDate
    })
  }

  const handleDateChange = (date: string) => {
    let dueDate = newInvoice.dueDate
    
    if (newInvoice.customerId) {
      const customer = customers.find(c => c.id === newInvoice.customerId)
      if (customer) {
        const invoiceDate = new Date(date)
        invoiceDate.setDate(invoiceDate.getDate() + customer.paymentTerms)
        dueDate = invoiceDate.toISOString().split('T')[0]
      }
    }
    
    setNewInvoice({
      ...newInvoice,
      date,
      dueDate
    })
  }

  const addInvoiceItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, {
        description: '',
        quantity: 1,
        unit: 'Stück',
        unitPrice: 0,
        discount: 0,
        vatRate: 7.7
      }]
    })
  }

  const removeInvoiceItem = (index: number) => {
    if (newInvoice.items.length > 1) {
      const newItems = newInvoice.items.filter((_, i) => i !== index)
      setNewInvoice({ ...newInvoice, items: newItems })
    }
  }

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...newInvoice.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setNewInvoice({ ...newInvoice, items: newItems })
  }

  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.unitPrice
    const discounted = subtotal * (1 - item.discount / 100)
    const withVat = discounted * (1 + item.vatRate / 100)
    return withVat
  }

  const calculateTotals = () => {
    const subtotal = newInvoice.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice
      const discounted = itemSubtotal * (1 - item.discount / 100)
      return sum + discounted
    }, 0)

    const vatAmount = newInvoice.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice
      const discounted = itemSubtotal * (1 - item.discount / 100)
      const vat = discounted * (item.vatRate / 100)
      return sum + vat
    }, 0)

    const total = subtotal + vatAmount - newInvoice.discountAmount

    return { subtotal, vatAmount, total }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!newInvoice.customerId) {
      showToast({ type: 'error', title: 'Please select a customer' })
      return
    }

    if (newInvoice.items.some(item => !item.description.trim())) {
      showToast({ type: 'error', title: 'Please fill in all item descriptions' })
      return
    }

    if (newInvoice.items.some(item => item.unitPrice <= 0)) {
      showToast({ type: 'error', title: 'Please enter valid unit prices' })
      return
    }

    try {
      setSubmitting(true)
      
      const invoiceData = {
        customerId: newInvoice.customerId,
        date: newInvoice.date,
        dueDate: newInvoice.dueDate,
        discountCode: newInvoice.discountCode || undefined,
        discountAmount: newInvoice.discountAmount || 0,
        items: newInvoice.items.map(item => ({
          description: item.description.trim(),
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          vatRate: item.vatRate
        }))
      }

      const response = await apiClient.createInvoice(invoiceData)
      
      if (response.success) {
        showToast({ 
          type: 'success', 
          title: 'Invoice created successfully!',
          message: `Invoice number: ${response.data.invoice.number}`
        })
        
        // Navigate to the new invoice detail page
        navigate(`/invoices/${response.data.invoice.id}`)
      } else {
        showToast({ type: 'error', title: 'Failed to create invoice' })
      }
    } catch (error) {
      console.error('Error creating invoice:', error)
      showToast({ type: 'error', title: 'Failed to create invoice' })
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
          <p className="mt-2 text-gray-600">Fill in the details below to create a new invoice</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Invoice Info */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Invoice Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer *
                  </label>
                  <select
                    value={newInvoice.customerId}
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
                    Invoice Date *
                  </label>
                  <input
                    type="date"
                    value={newInvoice.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {newInvoice.customerId && customers.find(c => c.id === newInvoice.customerId) 
                      ? `Auto-calculated from customer payment terms`
                      : 'Will be auto-calculated when customer is selected'}
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
                    value={newInvoice.discountCode}
                    onChange={(e) => setNewInvoice({...newInvoice, discountCode: e.target.value})}
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
                    value={newInvoice.discountAmount}
                    onChange={(e) => setNewInvoice({...newInvoice, discountAmount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Invoice Items */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Invoice Items</h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addInvoiceItem}
                  className="text-sm"
                >
                  ➕ Add Item
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {newInvoice.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-sm text-gray-700">
                        Item {index + 1}
                      </span>
                      {newInvoice.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInvoiceItem(index)}
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
                          onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
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
                          onChange={(e) => updateInvoiceItem(index, 'quantity', parseFloat(e.target.value) || 1)}
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
                          onChange={(e) => updateInvoiceItem(index, 'unit', e.target.value)}
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
                          onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
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
                          onChange={(e) => updateInvoiceItem(index, 'discount', parseFloat(e.target.value) || 0)}
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
                          onChange={(e) => updateInvoiceItem(index, 'vatRate', parseFloat(e.target.value))}
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
              <h2 className="text-lg font-medium text-gray-900">Invoice Summary</h2>
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
                  {newInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span>-CHF {newInvoice.discountAmount.toFixed(2)}</span>
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
              onClick={() => navigate('/invoices')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? 'Creating Invoice...' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateInvoice
