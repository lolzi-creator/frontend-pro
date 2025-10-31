import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'

const CustomerDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock customer data - in real app this would come from API
  const customer = {
    id: id || '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+41 44 123 45 67',
    website: 'https://acme.com',
    vatNumber: 'CHE-123.456.789',
    address: {
      street: 'Business Street 123',
      city: 'Zürich',
      postalCode: '8001',
      country: 'Switzerland'
    },
    contactPerson: {
      name: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '+41 44 123 45 68',
      position: 'Finance Manager'
    },
    status: 'active',
    customerSince: '2022-03-15',
    lastActivity: '2024-11-10',
    totalInvoices: 15,
    totalAmount: 125000.00,
    paidAmount: 118500.00,
    outstandingAmount: 6500.00,
    averagePaymentDays: 28,
    notes: 'Preferred contact method is email. Always pays on time. Interested in premium features.',
    tags: ['VIP', 'Enterprise', 'Long-term'],
    recentInvoices: [
      {
        id: '1',
        number: 'INV-2024-001',
        date: '2024-11-01',
        amount: 5500.00,
        status: 'paid',
        dueDate: '2024-11-15'
      },
      {
        id: '2',
        number: 'INV-2024-002',
        date: '2024-10-15',
        amount: 3200.00,
        status: 'paid',
        dueDate: '2024-10-30'
      },
      {
        id: '3',
        number: 'INV-2024-003',
        date: '2024-10-01',
        amount: 4800.00,
        status: 'pending',
        dueDate: '2024-11-15'
      },
      {
        id: '4',
        number: 'INV-2024-004',
        date: '2024-09-20',
        amount: 2100.00,
        status: 'overdue',
        dueDate: '2024-10-05'
      }
    ],
    recentQuotes: [
      {
        id: '1',
        number: 'Q-2024-015',
        date: '2024-11-05',
        amount: 8500.00,
        status: 'sent',
        validUntil: '2024-12-05'
      },
      {
        id: '2',
        number: 'Q-2024-014',
        date: '2024-10-20',
        amount: 4200.00,
        status: 'accepted',
        validUntil: '2024-11-20'
      }
    ],
    recentPayments: [
      {
        id: '1',
        amount: 5500.00,
        date: '2024-11-10',
        method: 'Bank Transfer',
        reference: 'PAY-001'
      },
      {
        id: '2',
        amount: 3200.00,
        date: '2024-10-25',
        method: 'Credit Card',
        reference: 'PAY-002'
      }
    ],
    activityLog: [
      {
        id: '1',
        type: 'invoice_created',
        description: 'Invoice INV-2024-001 created',
        timestamp: '2024-11-01 09:15',
        user: 'John Doe'
      },
      {
        id: '2',
        type: 'payment_received',
        description: 'Payment of CHF 5,500 received',
        timestamp: '2024-11-10 14:30',
        user: 'System'
      },
      {
        id: '3',
        type: 'quote_sent',
        description: 'Quote Q-2024-015 sent to customer',
        timestamp: '2024-11-05 11:20',
        user: 'Sarah Miller'
      },
      {
        id: '4',
        type: 'customer_updated',
        description: 'Customer information updated',
        timestamp: '2024-10-28 16:45',
        user: 'John Doe'
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'inactive':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
        )
      case 'suspended':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getQuoteStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
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
              Back to Customers
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Poppins'}}>
                {customer.name}
              </h2>
              <p className="text-gray-600">Customer Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.status)}`}>
              {getStatusIcon(customer.status)}
              <span className="ml-1 capitalize">{customer.status}</span>
            </span>
            <Button variant="outline">Edit Customer</Button>
            <Button variant="primary">New Invoice</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <p className="font-medium text-gray-900">
                        <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {customer.website}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">VAT Number</p>
                      <p className="font-medium text-gray-900">{customer.vatNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Street</p>
                      <p className="font-medium text-gray-900">{customer.address.street}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium text-gray-900">{customer.address.city} {customer.address.postalCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-medium text-gray-900">{customer.address.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Person</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{customer.contactPerson.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium text-gray-900">{customer.contactPerson.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{customer.contactPerson.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{customer.contactPerson.phone}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <p className="text-gray-700">{customer.notes}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Invoices</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Invoice #</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.recentInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/invoices/${invoice.id}`)}>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">{invoice.number}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{new Date(invoice.date).toLocaleDateString()}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">CHF {invoice.amount.toFixed(2)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInvoiceStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Quotes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Quotes</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Quote #</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Valid Until</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.recentQuotes.map((quote) => (
                      <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/quotes/${quote.id}`)}>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">{quote.number}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{new Date(quote.date).toLocaleDateString()}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">CHF {quote.amount.toFixed(2)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQuoteStatusColor(quote.status)}`}>
                            {quote.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600">{new Date(quote.validUntil).toLocaleDateString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Invoices</span>
                  <span className="text-lg font-bold text-gray-900">{customer.totalInvoices}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900">CHF {customer.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Paid Amount</span>
                  <span className="text-lg font-bold text-green-600">CHF {customer.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Outstanding</span>
                  <span className="text-lg font-bold text-red-600">CHF {customer.outstandingAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Payment Days</span>
                  <span className="text-lg font-bold text-gray-900">{customer.averagePaymentDays} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customer Since</span>
                  <span className="text-lg font-bold text-gray-900">{new Date(customer.customerSince).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Activity</span>
                  <span className="text-lg font-bold text-gray-900">{new Date(customer.lastActivity).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="primary" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                New Invoice
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                New Quote
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Record Payment
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2m-5.5-5.5l-5 5m0 0l-2.5-2.5L5 13.5" />
                </svg>
                Edit Customer
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:bg-red-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Customer
              </Button>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">CHF {payment.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{payment.method} • {payment.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.activityLog.map((activity) => (
                  <div key={activity.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-medium text-sm">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{activity.user}</span>
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail



