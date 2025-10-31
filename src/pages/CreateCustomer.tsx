import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import Card from '../components/Card'
import Button from '../components/Button'

interface NewCustomer {
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

const CreateCustomer: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [submitting, setSubmitting] = useState(false)
  
  const [newCustomer, setNewCustomer] = useState<NewCustomer>({
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

  const handleChange = (field: keyof NewCustomer, value: string | number | null) => {
    setNewCustomer({
      ...newCustomer,
      [field]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!newCustomer.name.trim()) {
      showToast({ type: 'error', title: 'Name is required' })
      return
    }

    if (!newCustomer.address.trim()) {
      showToast({ type: 'error', title: 'Address is required' })
      return
    }

    if (!newCustomer.zip.trim()) {
      showToast({ type: 'error', title: 'ZIP code is required' })
      return
    }

    if (!newCustomer.city.trim()) {
      showToast({ type: 'error', title: 'City is required' })
      return
    }

    if (newCustomer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email)) {
      showToast({ type: 'error', title: 'Please enter a valid email address' })
      return
    }

    try {
      setSubmitting(true)
      
      // Prepare customer data - filter out empty strings
      const customerData: any = {
        name: newCustomer.name.trim(),
        address: newCustomer.address.trim(),
        zip: newCustomer.zip.trim(),
        city: newCustomer.city.trim(),
        country: newCustomer.country,
        paymentTerms: newCustomer.paymentTerms,
        language: newCustomer.language
      }

      // Add optional fields only if they have values
      if (newCustomer.company.trim()) {
        customerData.company = newCustomer.company.trim()
      }
      if (newCustomer.email.trim()) {
        customerData.email = newCustomer.email.trim()
      }
      if (newCustomer.phone.trim()) {
        customerData.phone = newCustomer.phone.trim()
      }
      if (newCustomer.vatNumber.trim()) {
        customerData.vatNumber = newCustomer.vatNumber.trim()
      }
      if (newCustomer.uid.trim()) {
        customerData.uid = newCustomer.uid.trim()
      }
      if (newCustomer.creditLimit !== null && newCustomer.creditLimit > 0) {
        customerData.creditLimit = Math.round(newCustomer.creditLimit * 100) // Convert to Rappen
      }
      if (newCustomer.notes.trim()) {
        customerData.notes = newCustomer.notes.trim()
      }

      const response = await apiClient.createCustomer(customerData)
      
      if (response.success) {
        showToast({ 
          type: 'success', 
          title: 'Customer created successfully!',
          message: `Customer number: ${response.data.customer.customerNumber}`
        })
        
        // Navigate to the new customer detail page
        navigate(`/customers/${response.data.customer.id}`)
      } else {
        showToast({ type: 'error', title: 'Failed to create customer', message: response.error })
      }
    } catch (error: any) {
      console.error('Error creating customer:', error)
      showToast({ 
        type: 'error', 
        title: 'Failed to create customer',
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Customer</h1>
          <p className="mt-2 text-gray-600">Fill in the details below to create a new customer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={newCustomer.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="customer@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+41 44 123 45 67"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Address Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={newCustomer.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street address"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={newCustomer.zip}
                      onChange={(e) => handleChange('zip', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="8001"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={newCustomer.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Zurich"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={newCustomer.country}
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
              <h2 className="text-lg font-medium text-gray-900">Business Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT Number
                  </label>
                  <input
                    type="text"
                    value={newCustomer.vatNumber}
                    onChange={(e) => handleChange('vatNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CHE-123.456.789"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UID Number
                  </label>
                  <input
                    type="text"
                    value={newCustomer.uid}
                    onChange={(e) => handleChange('uid', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CHE-123.456.789"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms (days)
                  </label>
                  <input
                    type="number"
                    value={newCustomer.paymentTerms}
                    onChange={(e) => handleChange('paymentTerms', parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="365"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Default: 30 days
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Limit (CHF)
                  </label>
                  <input
                    type="number"
                    value={newCustomer.creditLimit || ''}
                    onChange={(e) => handleChange('creditLimit', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                    placeholder="Optional"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={newCustomer.language}
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
              <h2 className="text-lg font-medium text-gray-900">Additional Notes</h2>
            </div>
            <div className="p-6">
              <textarea
                value={newCustomer.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Any additional notes about this customer..."
              />
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/customers')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? 'Creating Customer...' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCustomer

