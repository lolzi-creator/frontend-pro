import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'

const PaymentDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const [payment, setPayment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayment = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const response = await apiClient.getPayment(id)
        console.log('[PaymentDetail] API response:', response)
        
        if (response?.success && response?.data) {
          setPayment(response.data.payment || response.data)
        } else {
          showToast({ type: 'error', title: t.payment.failedToLoadPayment || 'Failed to load payment' })
          navigate('/payments')
        }
      } catch (error) {
        console.error('Error fetching payment:', error)
        showToast({ type: 'error', title: 'Failed to load payment' })
        navigate('/payments')
      } finally {
        setLoading(false)
      }
    }

    fetchPayment()
  }, [id, navigate, showToast])

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">{t.payment.loadingPayment || 'Loading payment...'}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.payment.paymentNotFound || 'Payment not found'}</h2>
          <Button onClick={() => navigate('/payments')}>{t.payment.backToPayments || 'Back to Payments'}</Button>
        </div>
      </div>
    )
  }

  // Helper to format date
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
  }

  // Helper to format datetime
  const formatDateTime = (date: string | Date | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString()
  }

  const getStatusColor = (isMatched: boolean) => {
    return isMatched ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (isMatched: boolean) => {
    if (isMatched) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/payments')}
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.payment.backToPayments || 'Back to Payments'}
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Poppins'}}>
                {payment.reference || `Payment ${payment.id?.substring(0, 8)}`}
              </h2>
              <p className="text-gray-600">{t.payment.paymentDetails || 'Payment Details'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.isMatched || false)}`}>
              {getStatusIcon(payment.isMatched || false)}
              <span className="ml-1">{payment.isMatched ? (t.payment.matched || 'Matched') : (t.payment.unmatched || 'Unmatched')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t.payment.paymentInformation || 'Payment Information'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.payment.paymentDetails || 'Payment Details'}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">{t.payment.amount}</p>
                      <p className="text-2xl font-bold text-gray-900">CHF {((payment.amount || 0) / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.payment.reference}</p>
                      <p className="font-medium text-gray-900 font-mono">{payment.reference || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.payment.description}</p>
                      <p className="font-medium text-gray-900">{payment.description || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.payment.matchStatus || 'Match Status'}</p>
                      <p className="font-medium text-gray-900">{payment.isMatched ? (t.payment.matched || 'Matched') : (t.payment.unmatched || 'Unmatched')}</p>
                    </div>
                    {payment.confidence && (
                      <div>
                        <p className="text-sm text-gray-500">{t.payment.confidence || 'Confidence'}</p>
                        <p className="font-medium text-gray-900">{payment.confidence}</p>
                      </div>
                    )}
                    {payment.importBatch && (
                      <div>
                        <p className="text-sm text-gray-500">{t.payment.importBatch || 'Import Batch'}</p>
                        <p className="font-medium text-gray-900 font-mono text-xs">{payment.importBatch}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.payment.timeline || 'Timeline'}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">{t.payment.valueDate || 'Value Date'}</p>
                      <p className="font-medium text-gray-900">{formatDate(payment.valueDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.payment.createdAt || 'Created At'}</p>
                      <p className="font-medium text-gray-900">{formatDateTime(payment.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.payment.updatedAt || 'Updated At'}</p>
                      <p className="font-medium text-gray-900">{formatDateTime(payment.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {payment.notes && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.payment.notes || 'Notes'}</h3>
                  <p className="text-gray-700">{payment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Invoice */}
          {(payment.invoice || payment.invoiceId) && (
            <Card>
              <CardHeader>
                <CardTitle>{t.payment.relatedInvoice || 'Related Invoice'}</CardTitle>
              </CardHeader>
              <CardContent>
                {payment.invoice ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{payment.invoice.number || 'N/A'}</p>
                          {payment.invoice.customer?.name && (
                            <p className="text-sm text-gray-500">{payment.invoice.customer.name}</p>
                          )}
                          {payment.invoice.customer?.company && (
                            <p className="text-sm text-gray-500">{payment.invoice.customer.company}</p>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/invoices/${payment.invoiceId || payment.invoice.id}`)}
                      >
                        {t.payment.viewInvoice || 'View Invoice'}
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">{t.payment.invoiceDate || 'Invoice Date'}</p>
                        <p className="font-medium text-gray-900">{formatDate(payment.invoice.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t.payment.dueDate || 'Due Date'}</p>
                        <p className="font-medium text-gray-900">{formatDate(payment.invoice.dueDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t.payment.totalAmount || 'Total Amount'}</p>
                        <p className="font-medium text-gray-900">CHF {((payment.invoice.total || 0)).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t.payment.status}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          payment.invoice.status === 'PARTIAL_PAID' ? 'bg-yellow-100 text-yellow-800' :
                          payment.invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.invoice.status?.replace('_', ' ') || 'N/A'}
                        </span>
                      </div>
                      {payment.invoice.qrReference && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">{t.payment.qrReference || 'QR Reference'}</p>
                          <p className="font-medium text-gray-900 font-mono text-xs break-all">{payment.invoice.qrReference}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Invoice ID: {payment.invoiceId}</p>
                        <p className="text-sm text-gray-500">{t.payment.loadingInvoiceDetails || 'Loading invoice details...'}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/invoices/${payment.invoiceId}`)}
                    >
                      View Invoice
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Status */}
          <Card>
            <CardHeader>
                <CardTitle>{t.payment.status || 'Payment Status'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.payment.status}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.isMatched || false)}`}>
                    {getStatusIcon(payment.isMatched || false)}
                    <span className="ml-1">{payment.isMatched ? (t.payment.matched || 'Matched') : (t.payment.unmatched || 'Unmatched')}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.payment.amount}</span>
                  <span className="text-lg font-bold text-gray-900">CHF {((payment.amount || 0) / 100).toFixed(2)}</span>
                </div>
                {payment.confidence && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t.payment.confidence || 'Confidence'}</span>
                    <span className="text-sm font-medium text-gray-900">{payment.confidence}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t.payment.actions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!payment.isMatched && (
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => navigate(`/payments?match=${payment.id}`)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  {t.payment.matchToInvoice || 'Match to Invoice'}
                </Button>
              )}
              {payment.isMatched && (
                <Button variant="outline" className="w-full">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t.payment.unmatchPayment || 'Unmatch Payment'}
                </Button>
              )}
              <Button variant="outline" className="w-full text-red-600 hover:bg-red-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t.payment.deletePayment || 'Delete Payment'}
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default PaymentDetail



