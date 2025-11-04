import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
import { LoadingSpinner } from '../components'

const CustomerDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showError, showSuccess } = useToast()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (id) {
      fetchCustomerData()
    }
  }, [id])

  const fetchCustomerData = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      
      // Fetch customer
      const customerResponse = await apiClient.getCustomer(id)
      if (customerResponse.success) {
        setCustomer(customerResponse.data.customer)
      }

      // Fetch invoices for this customer (filter by customerId client-side)
      const invoicesResponse = await apiClient.getInvoices({ limit: 100 })
      if (invoicesResponse.success) {
        const allInvoices = invoicesResponse.data.invoices || invoicesResponse.data || []
        const invoiceList = allInvoices.filter((inv: any) => inv.customerId === id)
        const sortedInvoices = invoiceList.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setInvoices(sortedInvoices.slice(0, 5)) // Show only 5 most recent
        
        // Calculate stats from invoices
        const totalInvoices = invoiceList.length
        const totalAmount = invoiceList.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)
        const paidAmount = invoiceList.reduce((sum: number, inv: any) => sum + (inv.paidAmount || 0), 0)
        const outstandingAmount = totalAmount - paidAmount
        
        setStats({
          totalInvoices,
          totalAmount,
          paidAmount,
          outstandingAmount
        })
      }

      // Fetch quotes for this customer
      const quotesResponse = await apiClient.getQuotes({ customerId: id, limit: 10 })
      if (quotesResponse.success) {
        const quoteList = quotesResponse.data.quotes || quotesResponse.data || []
        const sortedQuotes = quoteList.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setQuotes(sortedQuotes.slice(0, 5)) // Show only 5 most recent
      }

    } catch (error) {
      console.error('Error fetching customer data:', error)
      showError(t.common.error, t.customer.failedToLoad)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !window.confirm(t.customer.deleteConfirmation?.replace('{{name}}', customer?.name || '') || 'Are you sure you want to delete this customer?')) return

    try {
      const response = await apiClient.deleteCustomer(id)
      if (response.success) {
        showSuccess(t.customer.delete, t.customer.customerDeleted || 'Customer has been deleted successfully')
        navigate('/customers')
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      showError(t.common.error, t.customer.failedToDelete || 'Failed to delete customer')
    }
  }

  if (loading) {
    return (
      <div className="p-8 h-full overflow-y-auto flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="p-8 h-full overflow-y-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">{t.customer.customerNotFound || 'Customer not found'}</p>
          <Button variant="outline" onClick={() => navigate('/customers')} className="mt-4">
            {t.customer.backToCustomers || t.common.back}
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getInvoiceStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'PARTIAL_PAID': return 'bg-yellow-100 text-yellow-800'
      case 'OPEN': return 'bg-blue-100 text-blue-800'
      case 'OVERDUE': return 'bg-red-100 text-red-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getQuoteStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SENT': return 'bg-blue-100 text-blue-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string | Date): string => {
    try {
      return new Date(dateString).toLocaleDateString('de-CH')
    } catch {
      return String(dateString)
    }
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/customers')}
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.customer.backToCustomers || t.common.back}
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Poppins'}}>
                {customer.name}
              </h2>
              <p className="text-gray-600">{t.customer.customerDetails || 'Customer Details'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.isActive)}`}>
              {customer.isActive ? (t.customer.active || 'Active') : (t.customer.inactive || 'Inactive')}
            </span>
            <Button variant="outline" onClick={() => navigate(`/customers/${id}/edit`)}>
              {t.customer.edit}
            </Button>
            <Button variant="primary" onClick={() => navigate(`/invoices/create?customerId=${id}`)}>
              {t.invoice.newInvoice || 'New Invoice'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t.customer.customerInformation || 'Customer Information'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.customer.basicInformation || 'Basic Information'}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">{t.customer.customerNumber || 'Customer Number'}</p>
                      <p className="font-medium text-gray-900">{customer.customerNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.customer.name}</p>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                    </div>
                    {customer.company && (
                      <div>
                        <p className="text-sm text-gray-500">{t.customer.company || 'Company'}</p>
                        <p className="font-medium text-gray-900">{customer.company}</p>
                      </div>
                    )}
                    {customer.email && (
                      <div>
                        <p className="text-sm text-gray-500">{t.customer.email}</p>
                        <p className="font-medium text-gray-900">{customer.email}</p>
                      </div>
                    )}
                    {customer.phone && (
                      <div>
                        <p className="text-sm text-gray-500">{t.customer.phone}</p>
                        <p className="font-medium text-gray-900">{customer.phone}</p>
                      </div>
                    )}
                    {customer.vatNumber && (
                      <div>
                        <p className="text-sm text-gray-500">{t.customer.vatNumber || 'VAT Number'}</p>
                        <p className="font-medium text-gray-900">{customer.vatNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.customer.address}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">{t.customer.address}</p>
                      <p className="font-medium text-gray-900">{customer.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.customer.city}</p>
                      <p className="font-medium text-gray-900">{customer.zip} {customer.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.customer.country}</p>
                      <p className="font-medium text-gray-900">{customer.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {customer.notes && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.customer.notes || 'Notes'}</h3>
                  <p className="text-gray-700">{customer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.customer.recentInvoices || 'Recent Invoices'}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate(`/invoices?customerId=${id}`)}>
                  {t.customer.viewAll || 'View All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-gray-500 text-center py-4">{t.customer.noInvoicesFound || 'No invoices found'}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">{t.invoice.number} #</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">{t.invoice.date}</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">{t.invoice.amount}</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">{t.invoice.status}</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">{t.invoice.dueDate}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/invoices/${invoice.id}`)}>
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900">{invoice.number}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-900">{formatDate(invoice.date)}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900">CHF {invoice.total.toFixed(2)}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInvoiceStatusColor(invoice.status)}`}>
                              {invoice.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-600">{formatDate(invoice.dueDate)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Quotes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.customer.recentQuotes || 'Recent Quotes'}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate(`/quotes?customerId=${id}`)}>
                  {t.customer.viewAll || 'View All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {quotes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">{t.customer.noQuotesFound || 'No quotes found'}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">{t.quote.number} #</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">{t.quote.date}</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">{t.quote.amount}</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">{t.quote.status}</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">{t.quote.expiryDate}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.map((quote) => (
                        <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/quotes/${quote.id}`)}>
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900">{quote.number}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-900">{formatDate(quote.date)}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900">CHF {quote.total.toFixed(2)}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQuoteStatusColor(quote.status)}`}>
                              {quote.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-600">{formatDate(quote.validUntil)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Stats */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>{t.customer.customerStatistics || 'Customer Statistics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t.customer.totalInvoices || 'Total Invoices'}</span>
                    <span className="text-lg font-bold text-gray-900">{stats.totalInvoices}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t.customer.totalAmount || 'Total Amount'}</span>
                    <span className="text-lg font-bold text-gray-900">CHF {stats.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t.customer.paidAmount || 'Paid Amount'}</span>
                    <span className="text-lg font-bold text-green-600">CHF {stats.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t.customer.outstanding || 'Outstanding'}</span>
                    <span className="text-lg font-bold text-red-600">CHF {stats.outstandingAmount.toFixed(2)}</span>
                  </div>
                  {customer.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t.customer.customerSince || 'Customer Since'}</span>
                      <span className="text-lg font-bold text-gray-900">{formatDate(customer.createdAt)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t.customer.actions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="primary" className="w-full" onClick={() => navigate(`/invoices/create?customerId=${id}`)}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t.invoice.newInvoice || 'New Invoice'}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/quotes/create?customerId=${id}`)}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {t.quote.newQuote || 'New Quote'}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/customers/${id}/edit`)}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2m-5.5-5.5l-5 5m0 0l-2.5-2.5L5 13.5" />
                </svg>
                {t.customer.edit}
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:bg-red-50" onClick={handleDelete}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t.customer.delete}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail
