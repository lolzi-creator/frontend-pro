import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api'

interface Quote {
  id: string
  number: string
  status: string
  date: string
  expiryDate: string
  subtotal: number
  vatAmount: number
  total: number
  currency: string
  customer?: {
    name: string
    email?: string
    company?: string
    address?: string
  }
  company?: {
    name: string
    email: string
    address: string
    city: string
    zip: string
  }
  items: Array<{
    description: string
    quantity: number
    unit: string
    unitPrice: number
    discount: number
    vatRate: number
    lineTotal: number
  }>
}

const AcceptQuote: React.FC = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')

  useEffect(() => {
    loadQuote()
  }, [token])

  const loadQuote = async () => {
    if (!token) {
      setError('Invalid token')
      setLoading(false)
      return
    }

    try {
      const response = await apiClient.getQuoteByToken(token)
      if (response.success) {
        setQuote(response.data.quote)
        
        // Check if already accepted/converted
        if (response.data.quote.status === 'ACCEPTED' || response.data.quote.status === 'CONVERTED') {
          setAccepted(true)
        }
      } else {
        setError(response.error || 'Quote not found')
      }
    } catch (error: any) {
      console.error('Error loading quote:', error)
      if (error.response?.data?.error) {
        setError(error.response.data.error)
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Failed to load quote')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!token || !quote) return

    setAccepting(true)
    
    try {
      const response = await apiClient.acceptQuote(token, customerEmail || quote.customer?.email)
      
      if (response.success) {
        setAccepted(true)
      } else {
        setError(response.error || 'Failed to accept quote')
      }
    } catch (error: any) {
      console.error('Error accepting quote:', error)
      if (error.response?.data?.error) {
        setError(error.response.data.error)
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Failed to accept quote')
      }
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quote...</p>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'Unable to load this quote. The link may be invalid or expired.'}</p>
          </div>
        </div>
      </div>
    )
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quote Accepted!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you! Your quote has been accepted and has been automatically converted to an invoice.
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Quote #{quote.number}</h2>
            <p className="text-gray-600">Total: CHF {quote.total.toFixed(2)}</p>
          </div>
          <p className="text-sm text-gray-500">
            You will receive the invoice via email shortly. If you have any questions, please contact us.
          </p>
        </div>
      </div>
    )
  }

  // Check if expired
  const isExpired = new Date() > new Date(quote.expiryDate)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Quote #{quote.number}</h1>
                <p className="text-orange-100 mt-1">Valid until {new Date(quote.expiryDate).toLocaleDateString()}</p>
              </div>
              {quote.company && (
                <div className="text-right text-white">
                  <p className="font-semibold">{quote.company.name}</p>
                  <p className="text-sm text-orange-100">{quote.company.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Expired Warning */}
          {isExpired && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-8 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">This quote has expired.</p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-8 py-6">
            {/* Customer and Company Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">From</h3>
                {quote.company && (
                  <div className="text-gray-700">
                    <p className="font-medium text-gray-900">{quote.company.name}</p>
                    <p>{quote.company.address}</p>
                    <p>{quote.company.zip} {quote.company.city}</p>
                    <p className="mt-2">{quote.company.email}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">To</h3>
                {quote.customer && (
                  <div className="text-gray-700">
                    <p className="font-medium text-gray-900">{quote.customer.name}</p>
                    {quote.customer.company && <p>{quote.customer.company}</p>}
                    {quote.customer.address && <p>{quote.customer.address}</p>}
                    {quote.customer.email && <p className="mt-2">{quote.customer.email}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Quote Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Services & Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Qty</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 px-4">{item.description}</td>
                        <td className="py-4 px-4">{item.quantity} {item.unit}</td>
                        <td className="py-4 px-4">CHF {item.unitPrice.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right">CHF {item.lineTotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-900">Subtotal</td>
                      <td className="py-4 px-4 text-right font-medium">CHF {quote.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-900">VAT</td>
                      <td className="py-4 px-4 text-right font-medium">CHF {quote.vatAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t-2 border-gray-300">
                      <td colSpan={3} className="py-4 px-4 text-right font-bold text-lg text-gray-900">Total</td>
                      <td className="py-4 px-4 text-right font-bold text-lg">CHF {quote.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Customer Email Input */}
            {!customerEmail && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email Address (optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  We'll send your invoice to this email address
                </p>
              </div>
            )}

            {/* Accept Button */}
            <div className="flex justify-center pt-8">
              <button
                onClick={handleAccept}
                disabled={accepting || isExpired}
                className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all ${
                  isExpired
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 text-white transform hover:scale-105'
                }`}
              >
                {accepting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Accept Quote'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AcceptQuote

