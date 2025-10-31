import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'
import ConfirmationModal from '../components/ConfirmationModal'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'

const QuoteDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const response = await apiClient.getQuote(id)
        if (response.success) {
          setQuote(response.data.quote)
        } else {
          showToast({ type: 'error', title: 'Failed to load quote' })
          navigate('/quotes')
        }
      } catch (error) {
        console.error('Error fetching quote:', error)
        showToast({ type: 'error', title: 'Failed to load quote' })
        navigate('/quotes')
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [id, navigate, showToast])

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'SENT': return 'bg-blue-100 text-blue-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'DECLINED': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      case 'CONVERTED': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DRAFT':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2m-5.5-5.5l-5 5m0 0l-2.5-2.5L5 13.5" />
          </svg>
        )
      case 'SENT':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )
      case 'ACCEPTED':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'DECLINED':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return null
    }
  }

  const handleSendEmail = async () => {
    if (!quote) return
    
    try {
      setActionLoading('send')
      const response = await apiClient.sendQuoteEmail(quote.id)
      
      if (response.success) {
        showToast({ 
          type: 'success', 
          title: 'Email Sent',
          message: `Quote has been sent to ${response.data.sentTo || 'customer'}.`
        })
      } else {
        showToast({ type: 'error', title: 'Failed to send email' })
      }
    } catch (error) {
      console.error('Error sending email:', error)
      showToast({ type: 'error', title: 'Failed to send email' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleConvertToInvoice = async () => {
    if (!quote || !quote.id) return
    
    if (window.confirm('Are you sure you want to convert this quote to an invoice? This action will create a new invoice and cannot be undone.')) {
      try {
        setActionLoading('convert')
        // Navigate to quote acceptance page which will auto-convert
        window.location.href = quote.acceptanceLink || ''
      } catch (error) {
        console.error('Error converting quote:', error)
        showToast({ type: 'error', title: 'Failed to convert quote' })
      } finally {
        setActionLoading(null)
      }
    }
  }

  const handleDownloadPDF = async () => {
    if (!quote) return
    
    try {
      setActionLoading('download')
      // Generate PDF on-the-fly
      const response = await fetch(`http://localhost:3001/api/v1/quotes/${quote.id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Quote-${quote.number}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        showToast({ type: 'success', title: 'PDF Downloaded' })
      } else {
        showToast({ type: 'error', title: 'Failed to download PDF' })
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      showToast({ type: 'error', title: 'Failed to download PDF' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDuplicate = async () => {
    // Removed - user doesn't want this functionality
  }

  const handleDelete = async () => {
    if (!quote) return
    
    try {
      setActionLoading('delete')
      const response = await apiClient.deleteQuote(quote.id)
      
      if (response.success) {
        showToast({ 
          type: 'success', 
          title: 'Quote Deleted',
          message: `Quote #${quote.number} has been deleted successfully.`
        })
        navigate('/quotes')
      } else {
        showToast({ type: 'error', title: 'Failed to delete quote' })
      }
    } catch (error) {
      console.error('Error deleting quote:', error)
      showToast({ type: 'error', title: 'Failed to delete quote' })
    } finally {
      setActionLoading(null)
      setDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading quote...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-600">Quote not found</p>
          <Button
            variant="outline"
            onClick={() => navigate('/quotes')}
            className="mt-4"
          >
            Back to Quotes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/quotes')}
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Quotes
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Poppins'}}>
                {quote.number}
              </h2>
              <p className="text-gray-600">Quote Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
              {getStatusIcon(quote.status)}
              <span className="ml-1 capitalize">{quote.status}</span>
            </span>
            <Button variant="outline" onClick={() => navigate(`/quotes/${quote.id}/edit`)}>Edit</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Details */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Company Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">From</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{quote.company?.name || 'N/A'}</p>
                    <p>{quote.company?.address || 'N/A'}</p>
                    <p>{quote.company?.zip} {quote.company?.city}</p>
                    {quote.company?.phone && <p>Phone: {quote.company.phone}</p>}
                    {quote.company?.email && <p>Email: {quote.company.email}</p>}
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quote For</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{quote.customer?.name || 'N/A'}</p>
                    {quote.customer?.company && <p>{quote.customer.company}</p>}
                    {quote.customer?.address && <p>{quote.customer.address}</p>}
                    {quote.customer?.email && <p>Email: {quote.customer.email}</p>}
                    {quote.customer?.phone && <p>Phone: {quote.customer.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Quote Details */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Quote Date</p>
                  <p className="font-medium text-gray-900">{new Date(quote.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Valid Until</p>
                  <p className="font-medium text-gray-900">{new Date(quote.expiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-900">CHF {(quote.total / 100).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Services & Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Qty</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Unit Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(quote.items || []).map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{item.description}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{item.quantity}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-900">CHF {(item.unitPrice / 100).toFixed(2)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">CHF {(item.lineTotal / 100).toFixed(2)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-900">
                        Subtotal
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        CHF {(quote.subtotal / 100).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-900">
                        VAT
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        CHF {(quote.vatAmount / 100).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={3} className="py-4 px-4 text-right font-bold text-lg text-gray-900">
                        Total
                      </td>
                      <td className="py-4 px-4 font-bold text-lg text-gray-900">
                        CHF {(quote.total / 100).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          {quote.internalNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.internalNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={handleSendEmail}
                disabled={actionLoading !== null}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send to Customer
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleConvertToInvoice}
                disabled={actionLoading !== null || quote.status === 'CONVERTED'}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Convert to Invoice
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleDownloadPDF}
                disabled={actionLoading !== null}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-red-600 hover:bg-red-50"
                onClick={() => setDeleteModal(true)}
                disabled={actionLoading !== null}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Quote
              </Button>
            </CardContent>
          </Card>

          {/* Quote Status */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                    {getStatusIcon(quote.status)}
                    <span className="ml-1 capitalize">{quote.status}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium text-gray-900">{new Date(quote.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valid Until</span>
                  <span className="text-sm font-medium text-gray-900">{new Date(quote.expiryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Days Remaining</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.max(0, Math.ceil((new Date(quote.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                  </span>
                </div>
                <div className="mt-4">
                  {quote.acceptanceLink && !quote.acceptanceLink.startsWith('undefined') ? (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-2">Acceptance Link:</p>
                      <p className="text-xs font-mono text-blue-800 break-all">{quote.acceptanceLink}</p>
                      <button
                        onClick={() => {
                          if (quote.acceptanceLink) {
                            navigator.clipboard.writeText(quote.acceptanceLink)
                            showToast({ type: 'success', title: 'Link copied to clipboard' })
                          }
                        }}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        Copy Link
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-xs text-yellow-800 mb-2">Acceptance link is invalid</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            setActionLoading('regenerate-link')
                            const response = await apiClient.regenerateQuoteAcceptanceLink(quote.id)
                            if (response.success) {
                              showToast({ type: 'success', title: 'Acceptance link regenerated' })
                              // Reload quote data
                              const quoteResponse = await apiClient.getQuote(quote.id)
                              if (quoteResponse.success) {
                                setQuote(quoteResponse.data.quote)
                              }
                            } else {
                              showToast({ type: 'error', title: 'Failed to regenerate link' })
                            }
                          } catch (error) {
                            console.error('Error regenerating link:', error)
                            showToast({ type: 'error', title: 'Failed to regenerate link' })
                          } finally {
                            setActionLoading(null)
                          }
                        }}
                        disabled={actionLoading !== null}
                      >
                        {actionLoading === 'regenerate-link' ? 'Regenerating...' : 'Regenerate Link'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Quote"
        message={`Are you sure you want to delete quote #${quote?.number}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}

export default QuoteDetail





