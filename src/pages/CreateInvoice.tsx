import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
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
  serviceDate: string // Leistungsdatum (zwingend für MWST-Abrechnung)
  discountCode: string
  discountAmount: number
  items: InvoiceItem[]
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()
  
  // Prevent number input value change on scroll - this annoying default behavior needs to die
  const preventScrollChange = (e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault()
  }
  
  // Global fix: Disable scroll on ALL number inputs when focused
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (document.activeElement?.tagName === 'INPUT' && 
          (document.activeElement as HTMLInputElement).type === 'number') {
        e.preventDefault()
      }
    }
    
    document.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      document.removeEventListener('wheel', handleWheel)
    }
  }, [])
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [vatRates, setVatRates] = useState<Array<{ value: number; label: string }>>([
    { value: 8.1, label: `8.1% (${t.invoice.vatStandard || 'Standard'})` },
    { value: 2.6, label: `2.6% (${t.invoice.vatReduced || 'Reduced'})` },
    { value: 3.8, label: `3.8% (${t.invoice.vatAccommodation || 'Accommodation'})` },
    { value: 0, label: `0% (${t.invoice.vatExempt || 'Exempt'})` }
  ])
  
  const [newInvoice, setNewInvoice] = useState<NewInvoice>({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    serviceDate: new Date().toISOString().split('T')[0], // Default to today
    discountCode: '',
    discountAmount: 0,
    items: [{
      description: '',
      quantity: 1,
      unit: t.invoice.unitPiece || 'Piece',
      unitPrice: 0,
      discount: 0,
      vatRate: 8.1
    }]
  })

  const units = [
    t.invoice.unitPiece || 'Piece',
    t.invoice.unitHour || 'Hour',
    t.invoice.unitDay || 'Day',
    t.invoice.unitKg || 'kg',
    t.invoice.unitLiter || 'Liter',
    t.invoice.unitMeter || 'Meter',
    t.invoice.unitFlat || 'Flat'
  ]

  useEffect(() => {
    loadCustomers()
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
        
        // Set default VAT rate for new items
        const defaultRate = response.data.vatRates.find((r: any) => r.isDefault)
        if (defaultRate && newInvoice.items.length > 0 && newInvoice.items[0].vatRate === 8.1) {
          setNewInvoice({
            ...newInvoice,
            items: newInvoice.items.map(item => ({
              ...item,
              vatRate: defaultRate.rate
            }))
          })
        }
      }
    } catch (error) {
      console.error('Error loading VAT rates:', error)
      // Use default rates if API fails
    }
  }

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getCustomers()
      if (response.success) {
        setCustomers(response.data.customers || [])
      }
    } catch (error) {
      console.error('Error loading customers:', error)
      showToast({ type: 'error', title: t.invoice.failedToLoadCustomers || 'Failed to load customers' })
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
        unit: t.invoice.unitPiece || 'Piece',
        unitPrice: 0,
        discount: 0,
        vatRate: 8.1
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
      showToast({ type: 'error', title: t.invoice.pleaseSelectCustomer || 'Please select a customer' })
      return
    }

    if (!newInvoice.serviceDate) {
      showToast({ type: 'error', title: 'Leistungsdatum ist zwingend erforderlich für die MWST-Abrechnung' })
      return
    }

    if (newInvoice.items.some(item => !item.description.trim())) {
      showToast({ type: 'error', title: t.invoice.pleaseFillDescriptions || 'Please fill in all item descriptions' })
      return
    }

    if (newInvoice.items.some(item => item.unitPrice <= 0)) {
      showToast({ type: 'error', title: t.invoice.pleaseEnterValidPrices || 'Please enter valid unit prices' })
      return
    }

    try {
      setSubmitting(true)
      
      const invoiceData = {
        customerId: newInvoice.customerId,
        date: newInvoice.date,
        dueDate: newInvoice.dueDate,
        serviceDate: newInvoice.serviceDate, // Leistungsdatum (zwingend)
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
          title: t.invoice.invoiceCreatedSuccess || 'Invoice created successfully!',
          message: `${t.invoice.invoiceNumber}: ${response.data.invoice.number}`
        })
        
        // Navigate to the new invoice detail page
        navigate(`/invoices/${response.data.invoice.id}`)
      } else {
        showToast({ type: 'error', title: t.invoice.failedToCreateInvoice || 'Failed to create invoice' })
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
          <p className="mt-4 text-gray-600">{t.invoice.loadingCustomers || 'Loading customers...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.invoice.create}</h1>
          <p className="mt-2 text-gray-600">{t.invoice.createSubtitle || 'Fill in the details below to create a new invoice'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Invoice Info */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t.invoice.invoiceDetails || 'Invoice Details'}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.invoice.customer} *
                  </label>
                  <select
                    value={newInvoice.customerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t.invoice.selectCustomer || 'Select Customer'}</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.customerNumber}) - {customer.paymentTerms} {t.invoice.days || 'days'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.invoice.date} *
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
                    {t.invoice.dueDate}
                  </label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {newInvoice.customerId && customers.find(c => c.id === newInvoice.customerId) 
                      ? (t.invoice.autoCalculatedFromTerms || 'Auto-calculated from customer payment terms')
                      : (t.invoice.willAutoCalculate || 'Will be auto-calculated when customer is selected')}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leistungsdatum * <span className="text-xs text-gray-500">(zwingend für MWST-Abrechnung)</span>
                  </label>
                  <input
                    type="date"
                    value={newInvoice.serviceDate}
                    onChange={(e) => setNewInvoice({...newInvoice, serviceDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Datum, an dem die Leistung erbracht wurde (für MWST-Abrechnung erforderlich)
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Discount */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t.invoice.discount || 'Discount'}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.invoice.discountCode || 'Discount Code'}
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
                    {t.invoice.discountAmount || 'Discount Amount'} (CHF)
                  </label>
                  <input
                    type="number"
                    value={newInvoice.discountAmount}
                    onChange={(e) => setNewInvoice({...newInvoice, discountAmount: parseFloat(e.target.value) || 0})}
                    onFocus={(e) => {
                      if (parseFloat(e.target.value) === 0) {
                        e.target.value = '';
                      }
                    }}
                    onWheel={preventScrollChange}
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
                <h2 className="text-lg font-medium text-gray-900">{t.invoice.invoiceItems || 'Invoice Items'}</h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addInvoiceItem}
                  className="text-sm"
                >
                  ➕ {t.invoice.addItem || 'Add Item'}
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {newInvoice.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-sm text-gray-700">
                        {t.invoice.item || 'Item'} {index + 1}
                      </span>
                      {newInvoice.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInvoiceItem(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          ❌ {t.common.delete || 'Remove'}
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t.invoice.description || 'Description'} *
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                          placeholder={t.invoice.descriptionPlaceholder || 'Service or product description'}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t.invoice.quantity || 'Quantity'} *
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                          onFocus={(e) => {
                            if (parseFloat(e.target.value) === 0 || parseFloat(e.target.value) === 1) {
                              e.target.value = '';
                            }
                          }}
                          onWheel={preventScrollChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                          min="0.001"
                          step="0.001"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t.invoice.unit || 'Unit'}
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
                          {t.invoice.unitPrice || 'Unit Price'} (CHF) *
                        </label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          onFocus={(e) => {
                            if (parseFloat(e.target.value) === 0) {
                              e.target.value = '';
                            }
                          }}
                          onWheel={preventScrollChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t.invoice.discount} (%)
                        </label>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => updateInvoiceItem(index, 'discount', parseFloat(e.target.value) || 0)}
                          onFocus={(e) => {
                            if (parseFloat(e.target.value) === 0) {
                              e.target.value = '';
                            }
                          }}
                          onWheel={preventScrollChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                          step="0.1"
                          min="0"
                          max="100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t.invoice.vat} (%)
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
                        {t.invoice.itemTotal || 'Item Total'}: CHF {calculateItemTotal(item).toFixed(2)}
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
              <h2 className="text-lg font-medium text-gray-900">{t.invoice.invoiceSummary || 'Invoice Summary'}</h2>
            </div>
            <div className="p-6">
              <div className="max-w-md ml-auto">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.invoice.subtotal}:</span>
                    <span>CHF {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.invoice.vat}:</span>
                    <span>CHF {vatAmount.toFixed(2)}</span>
                  </div>
                  {newInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>{t.invoice.discount}:</span>
                      <span>-CHF {newInvoice.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>{t.invoice.total}:</span>
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
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? (t.invoice.creating || 'Creating Invoice...') : t.invoice.create}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateInvoice




