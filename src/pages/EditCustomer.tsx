import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
import Card from '../components/Card'
import Button from '../components/Button'

interface Customer {
  name: string
  company: string
  email: string
  phone: string
  address: string
  zip: string
  city: string
  country: string
  vatNumber: string
  uid: string
  paymentTerms: number
  creditLimit: number | null
  language: string
  notes: string
}

const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    zip: '',
    city: '',
    country: 'CH',
    vatNumber: '',
    uid: '',
    paymentTerms: 30,
    creditLimit: null,
    language: 'de',
    notes: ''
  })

  const countries = [
    { value: 'CH', label: 'Switzerland' },
    { value: 'DE', label: 'Germany' },
    { value: 'AT', label: 'Austria' },
    { value: 'FR', label: 'France' },
    { value: 'IT', label: 'Italy' }
  ]

  const languages = [
    { value: 'de', label: 'German (Deutsch)' },
    { value: 'fr', label: 'French (Français)' },
    { value: 'it', label: 'Italian (Italiano)' },
    { value: 'en', label: 'English' }
  ]

  useEffect(() => {
    if (id) {
      loadCustomer()
    }
  }, [id])

  const loadCustomer = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      const response = await apiClient.getCustomer(id)
      if (response.success && response.data.customer) {
        const customerData = response.data.customer
        setCustomer({
          name: customerData.name || '',
          company: customerData.company || '',
          email: customerData.email || '',
          phone: customerData.phone || '',
          address: customerData.address || '',
          zip: customerData.zip || '',
          city: customerData.city || '',
          country: customerData.country || 'CH',
          vatNumber: customerData.vatNumber || '',
          uid: customerData.uid || '',
          paymentTerms: customerData.paymentTerms || 30,
          creditLimit: customerData.creditLimit ? customerData.creditLimit / 100 : null, // Convert from Rappen to CHF
          language: customerData.language || 'de',
          notes: customerData.notes || ''
        })
      } else {
        showToast({ type: 'error', title: t.customer.failedToLoad || 'Failed to load customer' })
        navigate('/customers')
      }
    } catch (error) {
      console.error('Error loading customer:', error)
      showToast({ type: 'error', title: t.customer.failedToLoad || 'Failed to load customer' })
      navigate('/customers')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof Customer, value: string | number | null) => {
    setCustomer({
      ...customer,
      [field]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id) return
    
    // Validation
    if (!customer.name.trim()) {
      showToast({ type: 'error', title: t.customer.nameRequired || 'Name is required' })
      return
    }

    if (!customer.address.trim()) {
      showToast({ type: 'error', title: t.customer.addressRequired || 'Address is required' })
      return
    }

    if (!customer.zip.trim()) {
      showToast({ type: 'error', title: t.customer.zipRequired || 'ZIP code is required' })
      return
    }

    if (!customer.city.trim()) {
      showToast({ type: 'error', title: t.customer.cityRequired || 'City is required' })
      return
    }

    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      showToast({ type: 'error', title: t.customer.validEmailRequired || 'Please enter a valid email address' })
      return
    }

    try {
      setSubmitting(true)
      
      // Prepare customer data - filter out empty strings
      const customerData: any = {
        name: customer.name.trim(),
        address: customer.address.trim(),
        zip: customer.zip.trim(),
        city: customer.city.trim(),
        country: customer.country,
        paymentTerms: customer.paymentTerms,
        language: customer.language
      }

      // Add optional fields only if they have values
      if (customer.company.trim()) {
        customerData.company = customer.company.trim()
      }
      if (customer.email.trim()) {
        customerData.email = customer.email.trim()
      }
      if (customer.phone.trim()) {
        customerData.phone = customer.phone.trim()
      }
      if (customer.vatNumber.trim()) {
        customerData.vatNumber = customer.vatNumber.trim()
      }
      if (customer.uid.trim()) {
        customerData.uid = customer.uid.trim()
      }
      if (customer.creditLimit !== null && customer.creditLimit > 0) {
        customerData.creditLimit = Math.round(customer.creditLimit * 100) // Convert to Rappen
      }
      if (customer.notes.trim()) {
        customerData.notes = customer.notes.trim()
      }

      const response = await apiClient.updateCustomer(id, customerData)
      
      if (response.success) {
        showToast({ 
          type: 'success', 
          title: t.customer.customerUpdated || 'Customer updated successfully!',
          message: t.customer.customerUpdatedSuccess || 'Customer has been updated successfully.'
        })
        
        navigate(`/customers/${id}`)
      } else {
        showToast({ type: 'error', title: t.customer.failedToUpdate || 'Failed to update customer', message: response.error })
      }
    } catch (error: any) {
      console.error('Error updating customer:', error)
      showToast({ 
        type: 'error', 
        title: t.customer.failedToUpdate || 'Failed to update customer',
        message: error.response?.data?.error || t.common.error
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.customer.loadingCustomer || 'Loading customer...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.customer.edit}</h1>
          <p className="mt-2 text-gray-600">{t.customer.editSubtitle || 'Update the customer details below'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t.customer.basicInformation || 'Basic Information'}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customer.fullName || 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.customer.namePlaceholder || 'John Doe'}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customer.company || 'Company'}
                  </label>
                  <input
                    type="text"
                    value={customer.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.customer.companyPlaceholder || 'Company Name'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customer.email}
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.customer.emailPlaceholder || 'customer@example.com'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customer.phone}
                  </label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.customer.phonePlaceholder || '+41 44 123 45 67'}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t.customer.addressInformation || 'Address Information'}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customer.address} *
                  </label>
                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.customer.addressPlaceholder || 'Street address'}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.customer.zipCode || 'ZIP Code'} *
                    </label>
                    <input
                      type="text"
                      value={customer.zip}
                      onChange={(e) => handleChange('zip', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="8001"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.customer.city} *
                    </label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t.customer.cityPlaceholder || 'Zurich'}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.customer.country}
                    </label>
                    <select
                      value={customer.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {countries.map(country => (
                        <option key={country.value} value={country.value}>{country.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Business Information */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t.customer.businessInformation || 'Business Information'}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customer.vatNumber || 'VAT Number'}
                  </label>
                  <input
                    type="text"
                    value={customer.vatNumber}
                    onChange={(e) => handleChange('vatNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CHE-123.456.789"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customer.uidNumber || 'UID Number'}
                  </label>
                  <input
                    type="text"
                    value={customer.uid}
                    onChange={(e) => handleChange('uid', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CHE-123.456.789"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customer.paymentTerms} ({t.customer.days || 'days'})
                  </label>
                  <input
                    type="number"
                    value={customer.paymentTerms}
                    onChange={(e) => handleChange('paymentTerms', parseInt(e.target.value) || 30)}
                    onFocus={(e) => {
                      if (parseInt(e.target.value) === 0) {
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="365"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {t.customer.defaultDays || 'Default: 30 days'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customer.creditLimit || 'Credit Limit'} (CHF)
                  </label>
                  <input
                    type="number"
                    value={customer.creditLimit || ''}
                    onChange={(e) => handleChange('creditLimit', e.target.value ? parseFloat(e.target.value) : null)}
                    onFocus={(e) => {
                      if (parseFloat(e.target.value) === 0) {
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                    placeholder={t.common.optional || 'optional'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customer.language}
                  </label>
                  <select
                    value={customer.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Notes */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t.customer.additionalNotes || 'Additional Notes'}</h2>
            </div>
            <div className="p-6">
              <textarea
                value={customer.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder={t.customer.notesPlaceholder || 'Any additional notes about this customer...'}
              />
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/customers/${id}`)}
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? (t.customer.updatingCustomer || 'Updating Customer...') : (t.customer.updateCustomer || 'Update Customer')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditCustomer

